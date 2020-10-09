import React from 'react';
import { Input, FullScreenDialog } from '../Mui';

export function Storage() {
  return (
    <FullScreenDialog.Section>
      <FullScreenDialog.Title children="Storage ( Read-Only )" />
      <FullScreenDialog.Row>
        <div className="preferences-label">Path</div>
        <Input value={window.STORAGE_DIRECTORY} readOnly className="filled" />
      </FullScreenDialog.Row>
    </FullScreenDialog.Section>
  );
}
