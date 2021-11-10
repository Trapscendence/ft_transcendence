import { Backdrop, CircularProgress } from '@mui/material';

interface LoadingBackdropProps {
  loading: boolean;
}

export default function LoadingBackdrop({
  loading,
}: LoadingBackdropProps): JSX.Element {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
