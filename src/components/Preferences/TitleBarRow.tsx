import React from 'react';
import { FullScreenDialog } from '../Mui/Dialog/FullScreenDialog';
import { Dropdown, MenuItem, useMuiMenu } from '../Mui';

interface Props {
  titleBar: TitleBar;
  onChange: (titleBar: TitleBar) => void;
}

export function TitleBarRow({ titleBar, onChange }: Props) {
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
