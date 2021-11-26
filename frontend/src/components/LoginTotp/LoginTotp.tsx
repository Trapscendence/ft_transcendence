import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import { SetStateAction, useEffect, useState } from 'react';

function submitToken(userToken: string) {
  const submitForm = document.createElement('form');
  submitForm.setAttribute('method', 'post');
  submitForm.setAttribute('action', '/api/auth/totp');
  document.body.appendChild(submitForm);

  const tokenInput = document.createElement('input');
  tokenInput.setAttribute('type', 'hidden');
  tokenInput.setAttribute('name', 'user_token');
  tokenInput.setAttribute('value', userToken);
  submitForm.appendChild(tokenInput);
  submitForm.submit();
}

const LoginTotp = (): JSX.Element => {
  const [tokenDigit1, setTokenDigit1] = useState<string>('');
  const [tokenDigit2, setTokenDigit2] = useState<string>('');
  const [tokenDigit3, setTokenDigit3] = useState<string>('');
  const [tokenDigit4, setTokenDigit4] = useState<string>('');
  const [tokenDigit5, setTokenDigit5] = useState<string>('');
  const [tokenDigit6, setTokenDigit6] = useState<string>('');

  const changeTokenDigit = (
    stateSetter: React.Dispatch<SetStateAction<string>>,
    event: { target: { value: string } }
  ) => {
    const value = event.target.value;
    if (/[0-9]/.test(value)) stateSetter(value);
    else stateSetter('');
  };

  useEffect(() => {
    const tokenDigitArray = [
      tokenDigit1,
      tokenDigit2,
      tokenDigit3,
      tokenDigit4,
      tokenDigit5,
      tokenDigit6,
    ];
    let token = '';
    for (const tokenDigit of tokenDigitArray) {
      console.log(`'${token}'`);
      if (tokenDigit) token = `${token}${tokenDigit}`;
      else return;
    }
    submitToken(token);
  }, [
    tokenDigit1,
    tokenDigit2,
    tokenDigit3,
    tokenDigit4,
    tokenDigit5,
    tokenDigit6,
  ]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
    >
      <Box
        width="500px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          id="token-digit-0"
          value={tokenDigit1}
          onChange={(event) => changeTokenDigit(setTokenDigit1, event)}
          variant="outlined"
        />
        <TextField
          id="token-digit-1"
          value={tokenDigit2}
          onChange={(event) => changeTokenDigit(setTokenDigit2, event)}
          variant="outlined"
        />
        <TextField
          id="token-digit-2"
          value={tokenDigit3}
          onChange={(event) => changeTokenDigit(setTokenDigit3, event)}
          variant="outlined"
        />
        <TextField
          id="token-digit-3"
          value={tokenDigit4}
          onChange={(event) => changeTokenDigit(setTokenDigit4, event)}
          variant="outlined"
        />
        <TextField
          id="token-digit-4"
          value={tokenDigit5}
          onChange={(event) => changeTokenDigit(setTokenDigit5, event)}
          variant="outlined"
        />
        <TextField
          id="token-digit-5"
          value={tokenDigit6}
          onChange={(event) => changeTokenDigit(setTokenDigit6, event)}
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

// Login.defaultProps = {
//   option: '!',
// };

export default LoginTotp;
