import React from 'react';
import { useRxInput, useRxAsync } from 'use-rx-hooks';
import { Button } from '@material-ui/core';
import { Input } from '../../components/Mui/Input';
import { FileUpload } from './FileUpload';
import { generateAuthUrl, getToken } from '../../service';
import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import { useAuthActions } from '../../store';

const installed = window.oAuth2Storage.get();

export function Auth() {
  const [value, inputProps] = useRxInput();
  const { authenticated } = useAuthActions();
  const { run, loading } = useRxAsync(getToken, {
    defer: true,
    onSuccess: authenticated
  });

  return (
    <div className="auth">
      <div className="auth-header">
        <LogoSvg className="logo" />
        <h4>Unoffical Google Task Clinet</h4>
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
              <Button disabled={loading} onClick={generateAuthUrl}>
                Get Code
              </Button>
              <Button
                disabled={loading}
                className="auth-confirm-button"
                onClick={() => run(value)}
              >
                Confirm
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
