import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiTooltip, {
  TooltipProps as MuiTooltipProps
} from '@material-ui/core/Tooltip';

export type TooltipProps = Omit<MuiTooltipProps, 'ref'>;

const fontSize = 14;
const PopperProps: TooltipProps['PopperProps'] = { disablePortal: true };

const useStyles = makeStyles((theme: Theme) => ({
  tooltip: {
    fontSize
  }
}));

const useErrorStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.error.main
  },
  tooltip: {
    fontSize,
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main
  }
}));

export function Tooltip(props: TooltipProps) {
  const classes = useStyles();
  return (
    <MuiTooltip {...props} classes={classes} PopperProps={PopperProps} arrow />
  );
}

export function ErrorTooltip(props: TooltipProps) {
  const classes = useErrorStyles();
  return (
    <MuiTooltip {...props} classes={classes} PopperProps={PopperProps} arrow />
  );
}
