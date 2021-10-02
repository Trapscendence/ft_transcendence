import Login from "./Login";

type LoginContainerProps = {
  tmp: string;
};

function LoginContainer({ tmp }: LoginContainerProps) {
  return <Login name="hello" mark="world" />;
}

export default LoginContainer;
