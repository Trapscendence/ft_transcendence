import { ApolloError } from '@apollo/client';
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

interface ErrorAlertProps {
  // children: React.ReactNode; // TODO: 물음표 붙이는건가?
  error?: ApolloError;
  name: string;
}

export default function ErrorAlert({
  error,
  name,
}: ErrorAlertProps): JSX.Element {
  // return (
  //   <Alert severity="error">
  //     {name}: {error?.message}
  //   </Alert>
  // );

  const [open, setOpen] = useState<boolean>(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
      <Alert severity="error" onClose={handleClose}>
        {name}: {error?.message}
      </Alert>
    </Snackbar>
  );
}
