import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import { Input, FullScreenDialog, FullScreenDialogProps } from '../Mui';
import { Switch } from '../Switch';
import { Appearance } from './Appearance';
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

  return (
    <FullScreenDialog {...props} className="preferences">
      <h4>Preferences</h4>

      <Form
        form={form}
        initialValues={preferences}
        onValuesChange={updatePreferences}
      >
        <FullScreenDialog.Section>
          <FullScreenDialog.Title children="General" />

          <Appearance />
          <AccentColor />

          <FullScreenDialog.Row>
            <div className="preferences-label">Maximum Tasks</div>
            <div className="preferences-max-tasks-selector">
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
            </div>
          </FullScreenDialog.Row>

          {window.platform === 'darwin' ? null : (
            <TitleBarRow titleBar={titleBar} onChange={window.__setTitleBar} />
          )}
        </FullScreenDialog.Section>

        <FullScreenDialog.Section>
          <FullScreenDialog.Title children="Synchronization" />

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
                          <Tooltip title="Cannot be empty">
                            <div>
                              <Input className="filled" />
                            </div>
                          </Tooltip>
                        </FormItem>
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
