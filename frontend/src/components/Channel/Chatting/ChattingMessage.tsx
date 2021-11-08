import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { IChatting } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';

interface ChattingMessageProps {
  IChatting: IChatting;
}

export default function ChattingMessage({
  IChatting,
}: ChattingMessageProps): JSX.Element {
  const { participant, text } = IChatting;

  return (
    <Box>
      <Box sx={{ display: 'inline-block' }}>
        <UserSummary nickname={participant.nickname} />
      </Box>
      <Typography sx={{ display: 'inline-block' }}>{text}</Typography>
    </Box>
  );
}
