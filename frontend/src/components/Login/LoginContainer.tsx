import { useState } from 'react';

// import { popupWindowCenter } from '../../utils/popupWindowCenter';
import Login from './Login';

function LoginContainer(): JSX.Element {
  const [buttonsEnabledState, setButtonsEnabledState] = useState<boolean>(true);

  const onClickLoginButton = (oauthStrategy: 'google' | '42'): void => {
    if (
      process.env.REACT_APP_BACKEND_HOST &&
      process.env.REACT_APP_BACKEND_PORT
    ) {
      setButtonsEnabledState(false);

      const loginURI = `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/login/${oauthStrategy}`;
      // popupWindow = popupWindowCenter(
      //   loginURI,
      //   `Login with ${oauthStrategy}`,
      //   400,
      //   800
      // );
      location.replace(loginURI);
    } else {
      throw `Undefined environment variables: ${
        process.env.REACT_APP_BACKEND_HOST ? '' : 'REACT_APP_BACKEND_HOST'
      } ${process.env.REACT_APP_BACKEND_PORT ? '' : 'REACT_APP_BACKEND_PORT'}`;
    }
  };

  return (
    <Login
      {...{
        onClickLoginButton,
        buttonsEnabledState,
      }}
    />
  );
}

export default LoginContainer;
