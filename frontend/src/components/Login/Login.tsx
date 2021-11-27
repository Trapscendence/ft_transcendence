import { useReactiveVar } from '@apollo/client';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { Redirect } from 'react-router';

import { userIdVar } from '../..';

function Login(): JSX.Element {
  const userId = useReactiveVar(userIdVar);

  const [buttonsEnabledState, setButtonsEnabledState] = useState<boolean>(true);

  const onClickLoginButton = (
    oauthStrategy: 'google' | '42' | 'dummy'
  ): void => {
    setButtonsEnabledState(false);
    const loginURI = `/api/auth/login/${oauthStrategy}`;
    location.replace(loginURI);
  };

  if (userId) return <Redirect to="/" />;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
      // bgcolor="gray"
    >
      <Box width="250px" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!buttonsEnabledState}
          onClick={() => onClickLoginButton('42')}
          sx={{ margin: '5px 0' }}
        >
          Log in with 42
        </Button>

        <Button
          variant="contained"
          color="secondary"
          disabled={!buttonsEnabledState}
          onClick={() => onClickLoginButton('google')}
          sx={{ margin: '5px 0' }}
        >
          Log in with Google
        </Button>

        <Button
          variant="contained"
          color="inherit"
          disabled={!buttonsEnabledState}
          onClick={() => onClickLoginButton('dummy')}
          sx={{ margin: '5px 0' }}
        >
          Dummy login for test
        </Button>
      </Box>
    </Box>
  );
}

// Login.defaultProps = {
//   option: '!',
// };

export default Login;
