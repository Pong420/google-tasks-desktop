import React, { useCallback, ChangeEvent, useState } from 'react';
import { classes } from '../../utils/classes';
import { useBoolean } from '../../utils/useBoolean';
import { oAuth2Storage } from '../../storage';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import fs from 'fs';

export function FileUpload() {
  const [dragover, { on, off }] = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const onChangeCallback = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    const { files } = evt.currentTarget;
    if (files && files.length && files[0].type === 'application/json') {
      try {
        const content = fs.readFileSync(files[0].path, 'utf-8');
        const data = JSON.parse(content);
        if (data.installed) {
          oAuth2Storage.setState(data).write();
          window.location.reload();
        } else {
          setErrorMsg('Invalid JSON file');
        }
      } catch (err) {
        setErrorMsg('Invalid JSON file');
      }
    } else {
      setErrorMsg('Invalid file or format');
    }
  }, []);

  return (
    <div className="file-upload">
      <div className="file-upload-header">
        <a
          href="https://github.com/Pong420/google-tasks-desktop#project-setup"
          target="_blank"
          rel="noopener noreferrer"
        >
          How to get OAuth2 JSON file
        </a>
      </div>
      <div className={classes('file-upload-content', dragover && 'dragover')}>
        <label htmlFor="file-upload-input">
          Choose the OAuth2 JSON file or drag it here.
        </label>
        <input
          type="file"
          name="files"
          id="file-upload-input"
          accept="application/json"
          onDragOver={on}
          onDrop={off}
          onDragLeave={off}
          onChange={onChangeCallback}
        />
      </div>
      <div className="file-upload-footer">
        {errorMsg && <ErrorOutline />} {errorMsg}
      </div>
    </div>
  );
}
