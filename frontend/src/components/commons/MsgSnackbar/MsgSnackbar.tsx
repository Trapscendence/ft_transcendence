import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

interface MsgSnackbarProps {
  msg: string;
  severity: 'error' | 'warning' | 'info' | 'success'; // NOTE: 이렇게 하는건가?
}

export default function MsgSnackbar({
  msg,
  severity,
}: MsgSnackbarProps): JSX.Element {
  return (
    <Snackbar open={!!msg} autoHideDuration={3000}>
      <Alert severity={severity}>{msg}</Alert>
    </Snackbar>
  );
}
