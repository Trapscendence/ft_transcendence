import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
//import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
interface NavigationProps {
  tabValue: number;
  handleChange: (e: React.SyntheticEvent, newValue: number) => void;
  //onClickGame: () => void;
  //onClickChat: () => void;
  //onClickDM: () => void;
}

function Navigation({
  tabValue,
  handleChange,
}: //onClickGame,
//onClickChat,
//onClickDM,
NavigationProps): JSX.Element {
  // const valueList = ['game', 'profile/my'];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        border: 0,
        bgcolor: '#7096FF',
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleChange}
        orientation="vertical"
        indicatorColor="primary"
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tab aria-label="game" icon={<VideogameAssetRoundedIcon />} />
        <Tab aria-label="chat" icon={<ForumRoundedIcon />} />
        <Tab aria-label="profile/my" icon={<PersonPinIcon />} />
      </Tabs>
      <Tab aria-label="DM" icon={<MailRoundedIcon />} />
    </Box>
  );
}

export default Navigation;
