import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Input,
  ErrorTooltip,
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui';
import { Switch } from '../Switch';
import { ThemeSelector } from './ThemeSelector';
import { AccentColor } from './AccentColor';
import { TitleBarRow } from './TitleBarRow';
import { Storage } from './Storage';
import { preferencesSelector, usePreferenceActions } from '../../store';
import { createForm, validators } from '../../utils/form';

const { Form, FormItem, useForm } = createForm<Schema$Preferences>();

const normalizeNumber = (value: string) => {
  const num = Number(value);
  return value === '' ||
    value === '-0' ||
    isNaN(num) ||
    /^0\d+/.test(value) ||
    /\.(0+)?$/.test(value)
    ? String(value)
    : num;
};

export function Preferences(props: FullScreenDialogProps) {
  const preferences = useSelector(preferencesSelector);
  const { updatePreferences } = usePreferenceActions();
  const { titleBar } = preferences;
  const [form] = useForm();
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <FullScreenDialog {...props} className="preferences">
      <h4>Preferences</h4>

      <Form
        form={form}
        initialValues={preferences}
        onValuesChange={changes =>
          form
            .validateFields()
            .then(() => updatePreferences(changes))
            .catch(() => {
              setErrors(
                form
                  .getFieldsError(['maxTasks', ['sync', 'inactiveHours']])
                  .map(payload => payload.errors[0])
              );
            })
        }
      >
        <FullScreenDialog.Section>
          <FullScreenDialog.Title children="Appearances" />

          <ThemeSelector />

          <AccentColor />

          {window.platform === 'darwin' ? null : (
            <TitleBarRow titleBar={titleBar} onChange={window.__setTitleBar} />
          )}
        </FullScreenDialog.Section>

        <FullScreenDialog.Section>
          <FullScreenDialog.Title children="Tasks" />

          <FullScreenDialog.Row>
            <div className="preferences-label">Maximum Tasks</div>
            <div className="preferences-max-tasks-selector">
              <ErrorTooltip
                enterDelay={0}
                placement="top"
                title={errors[0] || ''}
                open={!!errors[0]}
              >
                <span>
                  <FormItem
                    name="maxTasks"
                    normalize={normalizeNumber}
                    validators={[
                      validators.required('Cannot be empty'),
                      validators.number,
                      validators.integer('Plase input integer only'),
                      validators.min(0, 'Cannot less then 1')
                    ]}
                    noStyle
                  >
                    <Input className="filled" />
                  </FormItem>
                </span>
              </ErrorTooltip>
            </div>
          </FullScreenDialog.Row>

          <FullScreenDialog.Row>
            <div className="preferences-label">Enable synchronization</div>
            <div className="preferences-switch">
              <FormItem
                name={['sync', 'enabled']}
                valuePropName="checked"
                noStyle
              >
                <Switch />
              </FormItem>
            </div>
          </FullScreenDialog.Row>

          <FormItem deps={[['sync', 'enabled']]} noStyle>
            {({ sync }) => {
              if (sync.enabled) {
                return (
                  <>
                    <FullScreenDialog.Row>
                      <div className="preferences-label">
                        Sync on reconnection
                      </div>
                      <div className="preferences-hours">
                        <FormItem
                          name={['sync', 'reconnection']}
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch />
                        </FormItem>
                      </div>
                    </FullScreenDialog.Row>

                    <FullScreenDialog.Row>
                      <div className="preferences-label">
                        Sync after inactive
                      </div>
                      <div className="preferences-hours">
                        <ErrorTooltip
                          enterDelay={0}
                          placement="top"
                          title={errors[1] || ''}
                          open={!!errors[1]}
                        >
                          <span>
                            <FormItem
                              name={['sync', 'inactiveHours']}
                              normalize={normalizeNumber}
                              validators={[
                                validators.required('Cannot be empty'),
                                validators.number,
                                validators.integer('Plase input integer only'),
                                validators.min(1, 'Cannot less then 1')
                              ]}
                              noStyle
                            >
                              <Input className="filled" />
                            </FormItem>
                          </span>
                        </ErrorTooltip>
                        Hours
                      </div>
                    </FullScreenDialog.Row>
                  </>
                );
              }
              return <div />;
            }}
          </FormItem>
        </FullScreenDialog.Section>

        <Storage />
      </Form>
    </FullScreenDialog>
  );
}
