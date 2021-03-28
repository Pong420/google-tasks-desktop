import React, { useState } from 'react';
import { useRxInput, useRxAsync } from 'use-rx-hooks';
import { Button } from '@material-ui/core';
import { Input } from '../../components/Mui/Input';
import { FileUpload } from './FileUpload';
import { generateAuthUrl, getToken } from '../../service';
import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import { useAuthActions } from '../../store';

export function Auth() {
  const [value, inputProps] = useRxInput();
  const { authenticated } = useAuthActions();
  const [{ loading }, { fetch }] = useRxAsync(getToken, {
    defer: true,
    onSuccess: authenticated
  });
  const [installed, setInstanned] = useState(window.oAuth2Storage.get());

  return (
    <div className="auth">
      <div className="auth-header">
        <LogoSvg className="logo" />
        <h4>Unoffical Google Tasks Client</h4>
      </div>
      <div className="auth-content">
        {installed ? (
          <form>
            Paste the code here:
            <Input
              {...inputProps}
              className="filled bottom-border"
              disabled={loading}
              autoFocus
              fullWidth
            />
            <div>
              <div>
                <Button disabled={loading} onClick={generateAuthUrl}>
                  Get Code
                </Button>
                <Button
                  disabled={loading}
                  className="auth-confirm-button"
                  onClick={() => fetch(value)}
                >
                  Confirm
                </Button>
              </div>
              <Button
                className="auth-go-back"
                onClick={() => setInstanned(undefined)}
              >
                Go Back
              </Button>
            </div>
          </form>
        ) : (
          <FileUpload />
        )}
      </div>
    </div>
  );
}
