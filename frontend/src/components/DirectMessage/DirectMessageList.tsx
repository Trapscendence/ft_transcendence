import { useQuery } from '@apollo/client';
import {
  Avatar,
  Badge,
  Divider,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { GET_MY_BLACKLIST } from '../../utils/Apollo/gqls';
import { GetMyBlacklistResponse } from '../../utils/Apollo/responseModels';
import { UserData } from '../../utils/Apollo/User';
import { GET_USER } from '../../utils/Apollo/UserQuery';

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

  const { data: currentUserData } = useQuery<UserData>(GET_USER);
  const { data: blacklistData, error: blacklistError } =
    useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST, {
      variables: { id: currentUserData?.user.id },
    });

  useEffect(() => {
    blacklistData?.user.blacklist.forEach((value) => {
      if (value.id === ID) setBlackListed(true);
    });
  }, [blacklistData]);

  const [blackListed, setBlackListed] = useState(false);
  if (blackListed) return <Divider />;
  console.log(avatar);
  return (
    <ListItemButton
      selected={selectedIndex === ID}
      onClick={() => handleListItemClick(ID)}
    >
      <ListItemAvatar>
        <Badge variant="dot" overlap="circular" color="success">
          {avatar ? (
            <Avatar src={'/storage/' + avatar} />
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
