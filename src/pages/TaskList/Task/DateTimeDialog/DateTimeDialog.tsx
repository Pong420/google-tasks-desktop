import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext
} from 'react';
import {
  ConfirmDialog,
  ConfirmDialogProps
} from '../../../../components/Mui/Dialog';
import { DatePicker } from '../DatePicker';
import { useBoolean } from '../../../../hooks/useBoolean';

interface Props {
  date?: Date;
  onConfirm(date: Date): void;
}

type Control = Omit<
  ConfirmDialogProps,
  'onChange' | 'onConfirm' | 'confirmLabel'
>;

interface Context {
  openDateTimeDialog: (props: Props) => void;
}

const dialogClasses: ConfirmDialogProps['classes'] = {
  paper: 'date-time-dialog-paper'
};

const Context = createContext({} as Context);

export function useDateTimeDialog() {
  return useContext(Context);
}

export function DateTimeDialogProvider({ children }: { children: ReactNode }) {
  const [props, setProps] = useState<Props & Partial<Control>>();
  const [isOpen, open, close] = useBoolean();

  useEffect(() => {
    props && open();
  }, [props, open]);

  return (
    <Context.Provider value={{ openDateTimeDialog: setProps }}>
      {children}
      {props && (
        <DateTimeDialog
          {...props}
          open={isOpen}
          onClose={close}
          onExited={(...args) => {
            props.onExited && props.onExited(...args);
            setProps(undefined);
          }}
        />
      )}
    </Context.Provider>
  );
}

export const DateTimeDialog = ({
  date: defaultDate,
  onConfirm,
  ...props
}: Props &
  Omit<ConfirmDialogProps, 'onChange' | 'onConfirm' | 'confirmLabel'>) => {
  const [date, setDate] = useState(defaultDate || new Date());

  return (
    <ConfirmDialog
      confirmLabel="OK"
      classes={dialogClasses}
      onConfirm={() => {
        onConfirm(date);
      }}
      {...props}
    >
      <DatePicker value={defaultDate} onChange={setDate} />
    </ConfirmDialog>
  );
};
