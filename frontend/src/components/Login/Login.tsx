interface LoginProps {
  id: string;
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Login({
  id,
  onChangeId,
  password,
  onChangePassword,
  onSubmit,
}: LoginProps) {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="idTag" value={id} onChange={onChangeId} />
        <input
          name="passwordTag"
          value={password}
          onChange={onChangePassword}
        />
        <button>Sign In</button>
      </form>
    </div>
  );
}

// Login.defaultProps = {
//   option: '!',
// };

export default Login;
