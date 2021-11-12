import { useMutation, useQuery } from '@apollo/client';
import { MenuItem } from '@mui/material';

import { userIdVar } from '../../..';
import { BAN_USER, GET_MY_CHANNEL_ROLE, MUTE_USER } from '../../../utils/gqls';
import {
  BanUserResponse,
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
      variables: { mute_time: 10, user_id: id, channel_id: channelId }, // TODO: 우선 10초로 고정
    }
  );

  const [banUser, { error: banError }] = useMutation<BanUserResponse>(
    BAN_USER,
    {
      variables: { user_id: id, channel_id: channelId },
    }
  );

  if (channelRoleError) return <ErrorAlert error={channelRoleError} />;
  if (targetChannelRoleError)
    return <ErrorAlert error={targetChannelRoleError} />;
  if (muteError) return <ErrorAlert error={muteError} />;
  if (banError) return <ErrorAlert error={banError} />;

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
        Ban
      </MenuItem>
      <MenuItem key={2} onClick={() => muteUser()}>
        Mute
      </MenuItem>
    </>
  );
}
