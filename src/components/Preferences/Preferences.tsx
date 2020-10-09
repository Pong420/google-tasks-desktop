import React from 'react';
import { useSelector } from 'react-redux';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/Dialog/FullScreenDialog';
import { Input, Dropdown, MenuItem, useMuiMenu } from '../Mui';
import { Switch } from '../Switch';
import { preferencesSelector, usePreferenceActions } from '../../store';
import { createForm, validators } from '../../utils/form';

const accentColors: AccentColor[] = [
  'blue',
  'purple',
  'red',
  'amber',
  'green',
  'grey'
];

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

function TitleBarRow({
  titleBar,
  onChange
}: {
  titleBar: TitleBar;
  onChange: (titleBar: TitleBar) => void;
}) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  return (
    <FullScreenDialog.Row>
      <div className="preferences-label">Title Bar</div>
      <div className="preferences-title-bar-selector">
        <Dropdown
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClick={setAnchorEl}
          onClose={onClose}
          label={titleBar.replace(/^./, match => match.toUpperCase())}
        >
          <MenuItem
            text="Native"
            selected={titleBar === 'native'}
            onClick={() => onChange('native')}
            onClose={onClose}
          />
          <MenuItem
            text="Simple"
            selected={titleBar === 'simple'}
            onClick={() => onChange('simple')}
            onClose={onClose}
          />
        </Dropdown>
      </div>
    </FullScreenDialog.Row>
  );
}

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
          <FullScreenDialog.Row>
            <div className="preferences-label">Appearance</div>
            <div className="preferences-theme-selector">
              <div className="preferences-theme light">
                <div onClick={() => window.__setTheme('light')} />
              </div>
              <div className="preferences-theme dark">
                <div onClick={() => window.__setTheme('dark')} />
              </div>
            </div>
          </FullScreenDialog.Row>

          <FullScreenDialog.Row>
            <div className="preferences-label">Accent color</div>
            <div className="preferences-accent-color-selector">
              {accentColors.map((color, index) => (
                <div
                  key={index}
                  className={color}
                  onClick={() => window.__setAccentColor(color)}
                />
              ))}
            </div>
          </FullScreenDialog.Row>

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
                          <Input className="filled" />
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

        <FullScreenDialog.Section>
          <FullScreenDialog.Title children="Storage ( Read-Only )" />
          <FullScreenDialog.Row>
            <div className="preferences-label">Path</div>
            <Input
              value={window.STORAGE_DIRECTORY}
              readOnly
              className="filled"
            />
          </FullScreenDialog.Row>
        </FullScreenDialog.Section>
      </Form>
    </FullScreenDialog>
  );
}
