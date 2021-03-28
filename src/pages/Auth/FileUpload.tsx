import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { useBoolean } from '../../hooks/useBoolean';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

function readFile(file: File) {
  return new Promise<OAuthKeys>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target) {
        try {
          const content = JSON.parse(event.target.result as string);
          content.installed && resolve(content);
        } catch (error) {}
      }
      reject('Invalid JSON file');
    };
    reader.readAsText(file);
  });
}

function onSuccess(payload: OAuthKeys) {
  window.oAuth2Storage.save(payload);
  window.location.reload();
}

export function FileUpload() {
  const [isDragover, dragover, dragleave] = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');
  const [, { fetch }] = useRxAsync(readFile, {
    defer: true,
    onSuccess,
    onFailure: setErrorMsg
  });

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
      <div
        className={['file-upload-content', isDragover && 'dragover']
          .filter(Boolean)
          .join(' ')
          .trim()}
      >
        <label htmlFor="file-upload-input">
          Choose the OAuth2 JSON file or drag it here.
        </label>
        <input
          type="file"
          name="files"
          id="file-upload-input"
          accept="application/json"
          onDragOver={dragover}
          onDrop={dragleave}
          onDragLeave={dragleave}
          onChange={evt => {
            const { files } = evt.currentTarget;
            if (files && files.length && files[0].type === 'application/json') {
              fetch(files[0]);
            } else {
              setErrorMsg('Invalid file or format');
            }
          }}
        />
      </div>
      <div className="file-upload-footer">
        {errorMsg && <ErrorOutline />} {errorMsg}
      </div>
    </div>
  );
}
