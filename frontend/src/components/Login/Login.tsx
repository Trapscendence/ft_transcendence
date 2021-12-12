import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

function Login(): JSX.Element {
  const [buttonsEnabledState, setButtonsEnabledState] = useState<boolean>(true);

  const onClickLoginButton = (
    oauthStrategy: 'google' | '42' | 'dummy'
  ): void => {
    setButtonsEnabledState(false);
    const loginURI = `/api/auth/login/${oauthStrategy}`;
    location.replace(loginURI);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
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
          disabled
          // disabled={!buttonsEnabledState}
          onClick={() => onClickLoginButton('google')}
          sx={{ margin: '5px 0' }}
        >
          Log in with Google
        </Button>

        <Button
          variant="contained"
          color="inherit"
          disabled
          // disabled={!buttonsEnabledState}
          onClick={() => onClickLoginButton('dummy')}
          sx={{ margin: '5px 0' }}
        >
          Dummy login for test
        </Button>
      </Box>
    </Box>
  );
}

export default Login;

// NOTE
// * 제출할 것이므로 일단 다른 버튼은 disabled(비활성화)
