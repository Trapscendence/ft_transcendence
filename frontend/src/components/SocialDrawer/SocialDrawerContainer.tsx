import { useState } from 'react';
import SocialDrawer from './SocialDrawer';

export default function SocialDrawerContainer(): JSX.Element {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (openBool: boolean) => () => {
    setOpen(openBool);
  };

  return <SocialDrawer {...{ open, toggleDrawer }} />;
}
