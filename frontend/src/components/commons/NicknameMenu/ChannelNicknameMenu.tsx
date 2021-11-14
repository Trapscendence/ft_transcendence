import { useMutation, useQuery } from '@apollo/client';
import { Forum } from '@mui/icons-material';
import { ListItemIcon, MenuItem } from '@mui/material';

import { userIdVar } from '../../..';
import {
  BAN_AND_KICK_USER,
  GET_MY_CHANNEL_ROLE,
  MUTE_USER,
} from '../../../utils/gqls';
import {
  BanAndKickUserResponse,
  GetMyChannelRoleResponse,
  MuteUserResponse,
} from '../../../utils/responseModels';
import ErrorAlert from '../ErrorAlert';

interface ChannelNicknameMenuProps {
  channelId: string;
  id: string;
}

export default function ChannelNicknameMenu({
  channelId,
  id,
}: ChannelNicknameMenuProps): JSX.Element {
  const { data: channelRoleData, error: channelRoleError } =
    useQuery<GetMyChannelRoleResponse>(GET_MY_CHANNEL_ROLE, {
      variables: { id: userIdVar() },
    });

  const { data: targetChannelRoleData, error: targetChannelRoleError } =
    useQuery<GetMyChannelRoleResponse>(GET_MY_CHANNEL_ROLE, {
      variables: { id },
    });

  const [muteUser, { error: muteError }] = useMutation<MuteUserResponse>(
    MUTE_USER,
    {
      variables: { mute_time: 10000, user_id: id, channel_id: channelId }, // NOTE: 일단 시간은 고정... 추후 시간 조정하도록 구현
    }
  );

  const [banUser, { error: banError }] = useMutation<BanAndKickUserResponse>(
    BAN_AND_KICK_USER,
    {
      variables: { user_id: id, channel_id: channelId },
    }
  );

  if (channelRoleError)
    return (
      <ErrorAlert
        name="ChannelNicknameMenu: channelRoleError"
        error={channelRoleError}
      />
    );
  if (targetChannelRoleError)
    return (
      <ErrorAlert
        name="ChannelNicknameMenu: targetChannelRoleError"
        error={targetChannelRoleError}
      />
    );
  if (muteError)
    return (
      <ErrorAlert name="ChannelNicknameMenu: muteError" error={muteError} />
    );
  if (banError)
    return <ErrorAlert name="ChannelNicknameMenu: banError" error={banError} />;

  if (
    (channelRoleData && channelRoleData.user.channel_role === 'USER') ||
    (targetChannelRoleData &&
      targetChannelRoleData.user.channel_role !== 'USER')
  ) {
    return <></>;
  } // NOTE: 내가 channel_role이 User이거나, 상대가 channel_role이 User가 아니면... ban, mute 프론트에서 막기

  return (
    <>
      <MenuItem key={1} onClick={() => banUser()}>
        <ListItemIcon>
          <Forum fontSize="small" />
        </ListItemIcon>
        Ban
      </MenuItem>
      <MenuItem key={2} onClick={() => muteUser()}>
        <ListItemIcon>
          <Forum fontSize="small" />
        </ListItemIcon>
        Mute
      </MenuItem>
    </>
  );
}
