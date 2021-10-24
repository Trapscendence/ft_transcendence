import { ApolloError } from '@apollo/client';
import { Alert, Button, TextField } from '@mui/material';
import { Box } from '@mui/system';

interface LoginProps {
  id: string;
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickBtn: () => Promise<void>;
  loading: boolean;
  error: ApolloError | undefined;
}

function Login({
  id,
  onChangeId,
  password,
  onChangePassword,
  onClickBtn,
  loading,
  error,
}: LoginProps): JSX.Element {
  if (loading) return <span>loading...</span>;

  return (
    <Box width="250px" sx={{ display: 'flex', flexDirection: 'column' }}>
      <TextField
        size="small"
        label="id"
        value={id}
        onChange={onChangeId}
        sx={{ m: '5px 0' }}
      />
      <TextField
        size="small"
        label="password"
        type="password"
        value={password}
        onChange={onChangePassword}
        sx={{ m: '5px 0' }}
      />
      <Button variant="contained" onClick={onClickBtn} sx={{ margin: '5px 0' }}>
        Sign In
      </Button>
      {error ? (
        <Alert severity="error" sx={{ margin: '5px 0' }}>
          로그인에 실패했습니다.
        </Alert>
      ) : (
        ''
      )}
    </Box>
  );
}

// Login.defaultProps = {
//   option: '!',
// };

export default Login;
