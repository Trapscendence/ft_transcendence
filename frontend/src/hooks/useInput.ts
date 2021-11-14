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

// TODO: enter로 입력되게 개선 필요? 지금은 따로 onKeyPress 함수 쓰는 중... 이게 맞을 수도
