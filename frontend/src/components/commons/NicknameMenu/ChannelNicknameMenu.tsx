import { useMutation, useQuery } from '@apollo/client';
import { Forum } from '@mui/icons-material';
import { ListItemIcon, MenuItem } from '@mui/material';

import { userIdVar } from '../../..';
import {
  BAN_AND_KICK_USER,
  DELEGATE_USER_ON_CHANNEL,
  GET_MY_CHANNEL_ROLE,
  MUTE_USER,
  RELEGATE_USER_ON_CHANNEL,
} from '../../../utils/gqls';
import handleError from '../../../utils/handleError';
import {
  BanAndKickUserResponse,
  DelegateUserOnChannelResponse,
  GetMyChannelRoleResponse,
  MuteUserResponse,
  RelegateUserOnChannelResponse,
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
      // variables: { mute_time: 10000, user_id: id }, // NOTE: 에러는 이런 식으로 발생
    }
  );

  const [banUser, { error: banError }] = useMutation<BanAndKickUserResponse>(
    BAN_AND_KICK_USER,
    {
      variables: { user_id: id, channel_id: channelId },
    }
  );

  const [delegateUser, { error: delegateError }] =
    useMutation<DelegateUserOnChannelResponse>(DELEGATE_USER_ON_CHANNEL, {
      variables: { user_id: id, channel_id: channelId },
    });

  const [relegateUser, { error: relegateError }] =
    useMutation<RelegateUserOnChannelResponse>(RELEGATE_USER_ON_CHANNEL, {
      variables: { user_id: id, channel_id: channelId },
    });

  const errorVar =
    channelRoleError ||
    targetChannelRoleError ||
    muteError ||
    banError ||
    delegateError ||
    relegateError;

  if (errorVar)
    return <ErrorAlert name="ChannelNicknameMenu" error={errorVar} />;

  const isTargetAdmin = targetChannelRoleData?.user.channel_role !== 'USER';

  const canDelegate =
    channelRoleData?.user.channel_role === 'OWNER' &&
    targetChannelRoleData?.user.channel_role === 'USER';

  const canRelegate =
    channelRoleData?.user.channel_role === 'OWNER' &&
    targetChannelRoleData?.user.channel_role === 'ADMIN';

  if (channelRoleData?.user.channel_role === 'USER') {
    return <></>;
  } // NOTE: 내가 channel_role이 User면 얼리 리턴

  return (
    <>
      {!isTargetAdmin && (
        <>
          <MenuItem onClick={() => handleError(banUser)}>
            <ListItemIcon>
              <Forum fontSize="small" />
            </ListItemIcon>
            Ban
          </MenuItem>
          <MenuItem onClick={() => handleError(muteUser)}>
            <ListItemIcon>
              <Forum fontSize="small" />
            </ListItemIcon>
            Mute
          </MenuItem>
        </>
      )}
      {canDelegate && (
        <MenuItem onClick={() => handleError(delegateUser)}>
          <ListItemIcon>
            <Forum fontSize="small" />
          </ListItemIcon>
          Delegate admin
        </MenuItem>
      )}
      {canRelegate && (
        <MenuItem onClick={() => handleError(relegateUser)}>
          <ListItemIcon>
            <Forum fontSize="small" />
          </ListItemIcon>
          Relegate admin
        </MenuItem>
      )}
    </>
  );
}
