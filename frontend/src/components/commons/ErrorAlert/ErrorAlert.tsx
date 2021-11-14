import { ApolloError } from '@apollo/client';
import { Alert } from '@mui/material';

interface ErrorAlertProps {
  // children: React.ReactNode; // TODO: 물음표 붙이는건가?
  error?: ApolloError;
  name: string;
}

export default function ErrorAlert({
  error,
  name,
}: ErrorAlertProps): JSX.Element {
  return (
    <Alert severity="error">
      {name}: {error?.message}
    </Alert>
  );

  // return (
  //   <Snackbar
  //     open={true}
  //     autoHideDuration={3000}
  //     message={error.message}
  //     // action={action}
  //   />
  // );

  // const [open, setOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   if (error) setOpen(true);
  // });

  // const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setOpen(false);
  // };

  // return (
  //   <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
  //     <Alert severity="error">error: {error.message}</Alert>
  //   </Snackbar>
  // );
}
