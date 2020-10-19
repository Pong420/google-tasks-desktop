import React from 'react';
import { FullScreenDialog } from '../Mui/Dialog/FullScreenDialog';
import { Dropdown, MenuItem, useMuiMenu } from '../Mui';
import { Control } from '../../utils/form';

export function TitleBarRow({ value, onChange }: Control<TitleBar>) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const handleChange = onChange || (() => {});

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
            onClick={() => handleChange('native')}
            onClose={onClose}
          />
          <MenuItem
            text="Simple"
            selected={value === 'simple'}
            onClick={() => handleChange('simple')}
            onClose={onClose}
          />
        </Dropdown>
      </div>
    </FullScreenDialog.Row>
  );
}
