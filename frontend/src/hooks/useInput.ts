import { useState } from 'react';

export const useInput = (): [
  string,
  React.ChangeEventHandler<HTMLInputElement>
] => {
  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  return [value, onChange];
};
