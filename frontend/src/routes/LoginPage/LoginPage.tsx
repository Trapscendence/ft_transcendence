import { Box } from '@mui/system';

import Login from '../../components/Login';

function LoginPage(): JSX.Element {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
      // bgcolor="gray"
    >
      <Login />
    </Box>
  );
}

export default LoginPage;
