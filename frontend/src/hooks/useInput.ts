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
    if (e.target.value.length < 500) setValue(e.target.value);
  };
  return [value, setValue, onChange];
};

// NOTE: 500글자로 글자수 제한
