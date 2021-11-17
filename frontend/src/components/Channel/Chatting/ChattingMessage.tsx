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
    <Box>
      <Box sx={{ display: 'inline-block' }}>
        <UserSummary IUser={participant} channelId={channelId} />
      </Box>
      <Typography sx={{ display: 'inline-block' }}>{text}</Typography>
    </Box>
  );
}
