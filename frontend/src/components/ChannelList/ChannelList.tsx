import { Divider } from '@mui/material';
import { Box } from '@mui/system';

import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';

export default function ChannelList(): JSX.Element {
  // TODO: ChannelList 컴포넌트에서 훅 등 전체 관리

  return (
    <Box display="flex" flexDirection="column" p={3} pt={1}>
      <ChannelListHeader />
      {/* <Divider sx={{ my: 2, mx: -3 }} /> */}
      <Divider sx={{ my: 2 }} />
      <ChannelListContents />
    </Box>
  );
}
