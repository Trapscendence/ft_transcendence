import { useMutation, useQuery } from '@apollo/client';
import { Menu, MenuItem, MenuList } from '@mui/material';

import { userIdVar } from '../../..';
import { GET_MY_CHANNEL_ROLE } from '../../../utils/gqls';
import { GetMyChannelRoleResponse } from '../../../utils/responseModels';
import ErrorAlert from '../ErrorAlert';
import { BAN_USER, MUTE_USER } from './gqls';
import { BanUserResponse, MuteUserResponse } from './reseponseModels';

interface NicknameMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  channelId?: string;
  id: string;
}

export default function NicknameMenu({
  anchorEl,
  open,
  handleClose,
  channelId,
  id,
}: NicknameMenuProps): JSX.Element {
  const { data: channelRoleData, error: channelRoleError } =
    useQuery<GetMyChannelRoleResponse>(GET_MY_CHANNEL_ROLE, {
      variables: { id: userIdVar() },
    });

  const [muteUser, { error: muteError }] = useMutation<MuteUserResponse>(
    MUTE_USER,
    {
      variables: { mute_time: 60, user_id: id, channel_id: channelId }, // TODO: 테스트를 위해 1분으로 고정
    }
  );

  const [banUser, { error: banError }] = useMutation<BanUserResponse>(
    BAN_USER,
    {
      variables: { user_id: id, channel_id: channelId },
    }
  );

  // TODO: mute, ban, block이 있어야 할 것 같은데, 현재는 mute, ban, kick이 있음.
  // TODO: channel_role에 따라 나타나고 안나타나게

  if (channelRoleError) return <ErrorAlert error={channelRoleError} />;
  if (muteError) return <ErrorAlert error={muteError} />;
  if (banError) return <ErrorAlert error={banError} />;

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuList autoFocusItem={open}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>DM</MenuItem>
        <MenuItem>Observe the match</MenuItem>
        <MenuItem>Ask a match</MenuItem>
        {channelId && [
          <MenuItem key={0}>Block</MenuItem>,
          <MenuItem key={1} onClick={() => banUser()}>
            Ban
          </MenuItem>,
          <MenuItem key={2} onClick={() => muteUser()}>
            Mute
          </MenuItem>,
        ]}
      </MenuList>
    </Menu>
  );
}
