interface LoginProps {
  id: string;
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickBtn: () => Promise<void>;
}

function Login({
  id,
  onChangeId,
  password,
  onChangePassword,
  onClickBtn,
}: LoginProps): JSX.Element {
  return (
    <div>
      <input name="id" placeholder="id" value={id} onChange={onChangeId} />
      <input
        name="password"
        placeholder="password"
        value={password}
        onChange={onChangePassword}
      />
      <button onClick={onClickBtn}>Sign In</button>
    </div>
  );
}

// Login.defaultProps = {
//   option: '!',
// };

export default Login;
