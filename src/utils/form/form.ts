/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactElement, ReactNode } from 'react';
import RcForm, { Field as RcField, useForm as RcUseForm } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import { Meta, FieldError, Store } from 'rc-field-form/lib/interface';
import { Validator, compose as composeValidator } from './validators';
import { NamePath, Paths, PathType, DeepPartial, Control } from './typings';

type HTMLDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type HTMLLabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export interface FieldData<S extends {} = Store, Name = NamePath<S>>
  extends Partial<Omit<Meta, 'name'>> {
  name: Name;
  value?: Name extends Paths<S>
    ? PathType<S, Name>
    : Name extends keyof S
    ? S[Name]
    : undefined;
}

export type FormInstance<S extends {} = Store> = {
  getFieldValue<K extends keyof S>(name: K): S[K];
  getFieldValue<T extends Paths<S>>(name: T): PathType<S, T>;
  getFieldsValue(nameList?: NamePath<S>[]): S;
  getFieldError(name: NamePath<S>): string[];
  getFieldsError(nameList?: NamePath<S>[]): FieldError[];
  isFieldsTouched(
    nameList?: NamePath<S>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched(name: NamePath<S>): boolean;
  isFieldValidating(name: NamePath<S>): boolean;
  isFieldsValidating(nameList: NamePath<S>[]): boolean;
  resetFields(fields?: NamePath<S>[]): void;
  setFields(fields: FieldData<S, keyof S | NamePath<S>>[]): void;
  setFieldsValue(value: DeepPartial<S>): void;
  validateFields<K extends keyof S>(nameList?: NamePath<K>[]): Promise<S>;
  submit: () => void;
};

export interface FormProps<S extends {} = Store, V = S>
  extends Omit<RcFormProps, 'form' | 'onFinish' | 'onValuesChange'> {
  form?: FormInstance<S>;
  initialValues?: DeepPartial<V>;
  onFinish?: (values: V) => void;
  onValuesChange?: (changes: DeepPartial<S>, values: S) => void;
  ref?: React.Ref<FormInstance<S>>;
  transoformInitialValues?: (payload: DeepPartial<V>) => DeepPartial<S>;
  beforeSubmit?: (payload: S) => V;
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children' | 'rules'
>;

export interface FormItemLabelProps extends HTMLDivProps {
  label?: ReactNode;
}

interface BasicFormItemProps<S extends {} = Store>
  extends OmititedRcFieldProps {
  name?: NamePath<S>;
  children?: ReactElement | ((value: S) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: S) => Array<Validator | null>);
  label?: ReactNode;
  noStyle?: boolean;
  className?: string;
}

type Deps<S> = Array<NamePath<S>>;
type FormItemPropsDeps<S extends {} = Store> =
  | {
      deps?: Deps<S>;
      children?: ReactElement;
      validators?: Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      validators: (value: S) => Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      children: (value: S) => ReactElement;
    };

export type FormItemProps<S extends {} = Store> = BasicFormItemProps<S> &
  FormItemPropsDeps<S>;

export interface FormItemClassName {
  item?: string;
  label?: string;
  error?: string;
  touched?: string;
  validating?: string;
  help?: string;
}

type Rule = NonNullable<RcFieldProps['rules']>[number];

const getValues = (obj: any, paths: (string | number)[]) =>
  paths.reduce((result, key) => result && result[key], obj);

export function createShouldUpdate(
  names: Array<string | number | (string | number)[]> = []
): RcFieldProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      const paths = Array.isArray(name) ? name : [name];
      if (getValues(prev, paths) !== getValues(curr, paths)) {
        return true;
      }
    }
    return false;
  };
}

const defaultFormItemClassName: Required<FormItemClassName> = {
  item: 'rc-form-item',
  label: 'rc-form-item-label',
  error: 'rc-form-item-error',
  touched: 'rc-form-item-touched',
  validating: 'rc-form-item-validating',
  help: 'rc-form-item-help'
};

export function createForm<S extends {} = Store, V = S>({
  itemClassName,
  ...defaultProps
}: Partial<FormItemProps<S>> & { itemClassName?: FormItemClassName } = {}) {
  const ClassNames = { ...defaultFormItemClassName, ...itemClassName };

  const FormItemLabel: React.FC<FormItemLabelProps> = ({
    className = defaultProps.className,
    children,
    label,
    ...props
  }) =>
    React.createElement<HTMLDivProps>(
      'div',
      {
        ...props,
        className: [className, ClassNames.item].filter(Boolean).join(' ').trim()
      },
      React.createElement<HTMLLabelProps>(
        'label',
        { className: ClassNames.label },
        label
      ),
      children
    );

  const FormItem = (itemProps: FormItemProps<S>) => {
    const {
      name,
      children,
      validators = [],
      deps = [],
      noStyle,
      label,
      className = '',
      ...props
    } = {
      ...defaultProps,
      ...itemProps
    } as FormItemProps<S> & {
      deps?: Array<string | number | (string | number)[]>;
      name: string | number;
    };

    const rules: Rule[] = [
      typeof validators === 'function'
        ? ({ getFieldsValue }) => ({
            validator: composeValidator(validators(getFieldsValue(deps) as S))
          })
        : { validator: composeValidator(validators) }
    ];

    return React.createElement(
      RcField,
      {
        name,
        rules,
        ...(deps.length
          ? { dependencies: deps, shouldUpdate: createShouldUpdate(deps) }
          : {}),
        ...props
      },
      (
        control: Control<unknown>,
        { touched, validating, errors }: FieldData<S>,
        form: FormInstance<S>
      ) => {
        const { getFieldsValue } = form;

        const childNode =
          typeof children === 'function'
            ? children(getFieldsValue(deps))
            : name
            ? React.cloneElement(children as React.ReactElement, {
                ...control
              })
            : children;

        if (noStyle) {
          return childNode;
        }

        const error = errors && errors[0];

        return React.createElement<FormItemLabelProps>(
          FormItemLabel,
          {
            label,
            className: [
              className,
              error && ClassNames.error,
              touched && ClassNames.touched,
              validating && ClassNames.validating
            ]
              .filter(Boolean)
              .join(' ')
              .trim()
          },
          childNode,
          React.createElement<HTMLDivProps>(
            'div',
            { className: ClassNames.help },
            error
          )
        );
      }
    );
  };

  const Form = React.forwardRef<FormInstance<S>, FormProps<S, V>>(
    (
      {
        children,
        onFinish,
        beforeSubmit,
        initialValues,
        transoformInitialValues,
        ...props
      },
      ref
    ) =>
      React.createElement(
        RcForm,
        {
          ...props,
          ref,
          initialValues:
            initialValues && transoformInitialValues
              ? transoformInitialValues(initialValues)
              : initialValues,
          onFinish:
            onFinish &&
            ((store: unknown) => {
              onFinish(beforeSubmit ? beforeSubmit(store as S) : (store as V));
            })
        } as RcFormProps,
        children
      )
  );

  const useForm: () => [FormInstance<S>] = RcUseForm as any;

  return {
    Form,
    FormItem,
    FormList: RcForm.List,
    FormProvider: RcForm.FormProvider,
    FormItemLabel,
    useForm
  };
}

export const {
  Form,
  FormItem,
  FormItemLabel,
  FormList,
  useForm,
  FormProvider
} = createForm();
