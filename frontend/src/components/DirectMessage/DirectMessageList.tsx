import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';


interface DirectMessageListProps {
    avatar?: string;
    nickname: string;
    statusMessage?: string;
  }
  
function DirectMessageList({
    avatar,
    nickname,
    statusMessage,
  }: DirectMessageListProps): JSX.Element {
  return (
    <ListItem>
      <ListItemAvatar>
        <Badge variant="dot" overlap="circular" color="secondary">
          {avatar ? (
            <Avatar src={avatar} />
          ) : (
            <Avatar>{nickname[0].toUpperCase()}</Avatar>
          )}
        </Badge>
      </ListItemAvatar>
      {statusMessage ? (
        <ListItemText primary={nickname} secondary={statusMessage} />
      ) : (
        <ListItemText primary={nickname} />
      )}
    </ListItem>
  );
      }

export default DirectMessageList;
