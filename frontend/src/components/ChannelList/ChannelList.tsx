import { Divider } from '@mui/material';
import { Box } from '@mui/system';

import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';

// TODO: channel list는 subscription으로 주기적으로 새로고침하게 하기로 했었나?
// NOTE: participants는 owner, admin 포함한 전체 참가자

export default function ChannelList(): JSX.Element {
  // TODO: ChannelList 컴포넌트에서 훅 등 전체 관리... 하려 했으나 아마 따로 하는게 (성능상으로?) 나은 듯

  return (
    <Box display="flex" flexDirection="column" p={3} pt={1}>
      <ChannelListHeader />
      <Divider sx={{ my: 2, mx: -3 }} />
      <ChannelListContents />
    </Box>
  );
}

// TODO: 현재 방이 없거나 하나면 Divider가 짧게 (Header에 맞춰) 나타나는 이슈가 있다. 수정 필요
