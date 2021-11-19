import {
  Avatar,
  Badge,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

interface DirectMessageListProps {
  avatar?: string;
  nickname: string;
  ID: string;
  userStatus?: string;
  selectedIndex: string;
  setSelectedIndex: React.Dispatch<React.SetStateAction<string>>;
  setNewDm: React.Dispatch<React.SetStateAction<boolean>>;
}

function DirectMessageList({
  avatar,
  nickname,
  ID,
  setNewDm,
  selectedIndex,
  setSelectedIndex,
}: DirectMessageListProps): JSX.Element {
  const handleListItemClick = (index: string) => {
    setSelectedIndex(index);
    setNewDm(false);
  };
  //TODO addOffset으로 ID,0 넣어주기
  return (
    <ListItemButton
      selected={selectedIndex === ID}
      onClick={() => handleListItemClick(ID)}
    >
      <ListItemAvatar>
        <Badge variant="dot" overlap="circular" color="success">
          {avatar ? (
            <Avatar src={avatar} />
          ) : (
            <Avatar>{nickname[0].toUpperCase()}</Avatar>
          )}
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={nickname} sx={{ textOverflow: 'ellipsis' }} />

      {/* <Badge
        variant="standard"
        badgeContent={4}
        overlap="circular"
        color="primary"
      >
        4
      </Badge> */}
    </ListItemButton>
  );
}

export default DirectMessageList;
