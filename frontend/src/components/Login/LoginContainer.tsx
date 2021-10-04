import { useInput } from '../../hooks/useInput';
import Login from './Login';

function LoginContainer() {
  const [id, onChangeId] = useInput();
  const [password, onChangePassword] = useInput();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form: { id: string; password: string } = {
      id: (e.currentTarget.idTag as HTMLInputElement).value,
      password: (e.currentTarget.passwordTag as HTMLInputElement).value,
    };
  };

  return (
    <Login {...{ id, onChangeId, password, onChangePassword, onSubmit }} />
  );
}

export default LoginContainer;
