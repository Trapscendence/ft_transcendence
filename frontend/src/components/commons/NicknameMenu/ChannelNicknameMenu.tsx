import { useMutation, useQuery } from '@apollo/client';
import { Forum } from '@mui/icons-material';
import { ListItemIcon, MenuItem } from '@mui/material';

import {
  BAN_USER,
  DELEGATE_USER_ON_CHANNEL,
  GET_CHANNEL_ROLE,
  GET_MY_CHANNEL_ROLE,
  KICK_USER,
  MUTE_USER,
  RELEGATE_USER_ON_CHANNEL,
} from '../../../utils/Apollo/gqls';
import {
  BanUserResponse,
  DelegateUserOnChannelResponse,
  GetChannelRoleResponse,
  GetMyChannelRoleResponse,
  KickUserResponse,
  MuteUserResponse,
  RelegateUserOnChannelResponse,
} from '../../../utils/Apollo/responseModels';
import handleError from '../../../utils/handleError';
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
    useQuery<GetMyChannelRoleResponse>(GET_MY_CHANNEL_ROLE);

  const { data: targetChannelRoleData, error: targetChannelRoleError } =
    useQuery<GetChannelRoleResponse>(GET_CHANNEL_ROLE, {
      variables: { id },
    });

  const [muteUser, { error: muteError }] = useMutation<MuteUserResponse>(
    MUTE_USER,
    {
      variables: { user_id: id },
    }
  );

  const [kickUser, { error: kickError }] = useMutation<KickUserResponse>(
    KICK_USER,
    {
      variables: { user_id: id },
    }
  );

  const [banUser, { error: banError }] = useMutation<BanUserResponse>(
    BAN_USER,
    {
      variables: { user_id: id },
    }
  );

  const [delegateUser, { error: delegateError }] =
    useMutation<DelegateUserOnChannelResponse>(DELEGATE_USER_ON_CHANNEL, {
      variables: { user_id: id },
    });

  const [relegateUser, { error: relegateError }] =
    useMutation<RelegateUserOnChannelResponse>(RELEGATE_USER_ON_CHANNEL, {
      variables: { user_id: id },
    });

  const errorVar =
    channelRoleError ||
    targetChannelRoleError ||
    muteError ||
    kickError ||
    banError ||
    delegateError ||
    relegateError;

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
      {errorVar && <ErrorAlert name="ChannelNicknameMenu" error={errorVar} />}
      {!isTargetAdmin && (
        <>
          <MenuItem onClick={() => handleError(muteUser)}>
            <ListItemIcon>
              <Forum fontSize="small" />
            </ListItemIcon>
            Mute
          </MenuItem>
          <MenuItem onClick={() => handleError(kickUser)}>
            <ListItemIcon>
              <Forum fontSize="small" />
            </ListItemIcon>
            Kick
          </MenuItem>
          <MenuItem onClick={() => handleError(banUser)}>
            <ListItemIcon>
              <Forum fontSize="small" />
            </ListItemIcon>
            Ban
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
