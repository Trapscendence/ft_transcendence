import { gql, useMutation } from '@apollo/client';

import { useInput } from '../../hooks/useInput';
import Login from './Login';

// 임시
const POST_SIGNIN = gql`
  mutation PostSignin($id: String!, $password: String!) {
    signin(id: $id, password: $password) {
      token
    }
  }
`;

function LoginContainer(): JSX.Element {
  const [id, setId, onChangeId] = useInput('');
  const [password, setPassword, onChangePassword] = useInput('');
  const [postSignin, { loading, error }] = useMutation(POST_SIGNIN);
  const onClickBtn = async (): Promise<void> => {
    try {
      await postSignin({ variables: { id, password } });
    } catch (e) {
      console.error(e);
    }
    setId('');
    setPassword('');
  };

  return (
    <Login
      {...{
        id,
        onChangeId,
        password,
        onChangePassword,
        onClickBtn,
        loading,
        error,
      }}
    />
  );
}

export default LoginContainer;
