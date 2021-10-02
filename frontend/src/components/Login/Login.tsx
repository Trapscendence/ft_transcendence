type LoginProps = {
  name: string;
  mark: string;
  option?: string;
};

function Login({ name, mark }: LoginProps) {
  return <div>i'm login component!</div>;
}

Login.defaultProps = {
  option: "!",
};

export default Login;
