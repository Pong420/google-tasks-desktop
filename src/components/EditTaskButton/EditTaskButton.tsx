import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import {
  Dropdown,
  FullScreenDialog,
  Input,
  useMuiMenu,
  useMenuItem
} from '../Mui';
import { useBoolean } from '../../utils/useBoolean';

export function EditTaskButton() {
  const [open, { on, off }] = useBoolean();
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

  return (
    <>
      <IconButton className="edit-task-button" onClick={on}>
        <EditIcon />
      </IconButton>
      <FullScreenDialog open={open} handleClose={off}>
        <Input placeholder="Enter title" autoFocus />
        <Input placeholder="Add details" multiline rows={3} />
        <div className="row">
          <FormatListBulletedIcon />
          <Dropdown
            label="main"
            anchorEl={anchorEl}
            onClick={setAnchorEl}
            onClose={onClose}
            open={Boolean(anchorEl)}
            anchorPosition={{
              top: anchorEl ? anchorEl.offsetTop : 0,
              left: anchorEl ? anchorEl.offsetLeft : 0
            }}
            anchorReference="anchorPosition"
            PaperProps={{
              style: {
                width: `calc(100% - ${anchorEl && anchorEl.offsetLeft + 15}px)`
              }
            }}
            MenuListProps={{
              style: {
                padding: 0
              }
            }}
          >
            <MenuItem>main</MenuItem>
          </Dropdown>
        </div>
      </FullScreenDialog>
    </>
  );
}
