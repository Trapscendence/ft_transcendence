import { useState } from 'react';

export const useInput = (
  initialState: string
): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  React.ChangeEventHandler<HTMLInputElement>
] => {
  const [value, setValue] = useState<string>(initialState);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };
  return [value, setValue, onChange];
};
