import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { IChatting } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';

interface ChattingMessageProps {
  IChatting: IChatting;
  channelId: string;
}

export default function ChattingMessage({
  IChatting,
  channelId,
}: ChattingMessageProps): JSX.Element {
  const { participant, text } = IChatting;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'inline-block' }}>
        <UserSummary IUser={participant} channelId={channelId} />
      </Box>
      <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
        {text}
      </Typography>
    </Box>
  );
}

// NOTE: wordWrap: 'break-word' 옵션이 없으면, 띄어쓰기가 없는 경우 줄바꿈이 되지 않는다.
