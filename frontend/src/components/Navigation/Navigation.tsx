import { Tab, Tabs } from '@mui/material';

interface NavigationProps {
  tabValue: number;
  handleChange: (e: React.SyntheticEvent, newValue: number) => void;
  onClickGame: () => void;
  onClickChat: () => void;
  onClickDM: () => void;
}

function Navigation({
  tabValue,
  handleChange,
  onClickGame,
  onClickChat,
  onClickDM,
}: NavigationProps): JSX.Element {
  return (
    <Tabs value={tabValue} onChange={handleChange} orientation="vertical">
      <Tab label="Game Rooms" onClick={onClickGame} />
      <Tab label="Chat Rooms" onClick={onClickChat} />
      <Tab label="DM" onClick={onClickDM} />
    </Tabs>
  );
}

export default Navigation;
