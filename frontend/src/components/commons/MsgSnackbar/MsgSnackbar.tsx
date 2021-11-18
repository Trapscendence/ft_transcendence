import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

interface MsgSnackbarProps {
  msg: string;
  severity: 'error' | 'warning' | 'info' | 'success'; // NOTE: 이렇게 하는건가?
}

export default function MsgSnackbar({
  msg,
  severity,
}: MsgSnackbarProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(true);

  // const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpen(false);
  // };

  // useEffect(() => {
  //   setOpen(true);
  // }, []);

  return (
    <Snackbar open={open} autoHideDuration={3000}>
      {/* <Alert severity={severity} onClose={handleClose}> */}
      <Alert severity={severity}>{msg}</Alert>
    </Snackbar>
  );
}
