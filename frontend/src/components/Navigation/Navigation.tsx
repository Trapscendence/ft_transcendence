import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';

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
    <Box>
      <Tabs value={tabValue} onChange={handleChange} orientation="vertical">
        <Tab label="Home" onClick={onClickGame} />
        <Tab label="Chat" onClick={onClickChat} />
        <Tab label="DM" onClick={onClickDM} />
      </Tabs>
    </Box>
  );
}

export default Navigation;
