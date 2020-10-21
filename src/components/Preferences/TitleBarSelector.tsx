import React, { useState } from 'react';
import { FullScreenDialog, ConfirmDialog } from '../Mui';
import { Dropdown, MenuItem, useMuiMenu } from '../Mui';
import { Control } from '../../utils/form';

const exlucded: Array<Window['platform']> = ['darwin', 'win32'];
const shouldRelaunch = !exlucded.includes(window.platform);

export function TitleBarSelector({ value, onChange }: Control<TitleBar>) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const [change, setChange] = useState<TitleBar | null>(null);
  const [shouldClose, setShoudClose] = useState(false);
  const handleChange = onChange || (() => {});
  const hadnleSelect = shouldRelaunch ? setChange : handleChange;

  return (
    <FullScreenDialog.Row>
      <div className="preferences-label">Title Bar</div>
      <div className="preferences-title-bar-selector">
        <Dropdown
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClick={setAnchorEl}
          onClose={onClose}
          label={value?.replace(/^./, match => match.toUpperCase())}
        >
          <MenuItem
            text="Native"
            selected={value === 'native'}
            onClick={() => hadnleSelect('native')}
            onClose={onClose}
          />
          <MenuItem
            text="Frameless"
            selected={value === 'frameless'}
            onClick={() => hadnleSelect('frameless')}
            onClose={onClose}
          />
        </Dropdown>
        {shouldRelaunch && (
          <ConfirmDialog
            title="Notice"
            open={!!change}
            onClose={() => setChange(null)}
            onConfirm={() => {
              if (change && change !== value) {
                handleChange(change);
                setShoudClose(true);
              }
            }}
            onExited={() => shouldClose && window.relaunch()}
          >
            This will relaunch your application and the changes to take effect
            after relaunch
          </ConfirmDialog>
        )}
      </div>
    </FullScreenDialog.Row>
  );
}
