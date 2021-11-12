import { Button } from '@mui/material';
import { Box } from '@mui/system';

interface LoginProps {
  onClickLoginButton: (oauthStrategy: 'google' | '42') => void;
  buttonsEnabledState: boolean;
}

function Login({
  onClickLoginButton,
  buttonsEnabledState,
}: LoginProps): JSX.Element {
  return (
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
    </Box>
  );
}

// Login.defaultProps = {
//   option: '!',
// };

export default Login;
