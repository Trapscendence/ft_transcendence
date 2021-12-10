import { useState } from 'react';

export default function useSnackbar(
  time: number
): [string | null, (msg: string) => void] {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const displayAlertMsg = (msg: string): void => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, time);
  };

  return [alertMsg, displayAlertMsg];
}
