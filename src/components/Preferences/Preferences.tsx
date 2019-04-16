import React from 'react';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/FullScreenDialog';
import { Input } from '../Mui/Input';
import { TOKEN_PATH } from '../../constants';

export function Preferences({ ...props }: FullScreenDialogProps) {
  return (
    <FullScreenDialog className="preferences" {...props}>
      <h4>Preferences</h4>
      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="Storage" />
        <FullScreenDialog.Row>
          <div className="preferences-label">Toke Path:</div>
          <Input value={TOKEN_PATH} readOnly className="filled" />
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>
    </FullScreenDialog>
  );
}
