// import { useReactiveVar } from '@apollo/client';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

// import { chattingMessagesVar } from '../../..';
import { ChattingSummary } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';

interface ChattingMessageProps {
  chattingSummary: ChattingSummary;
}

export default function ChattingMessage({
  chattingSummary,
}: ChattingMessageProps): JSX.Element {
  const { participant, text } = chattingSummary;

  return (
    <Box>
      <UserSummary nickname={participant.nickname} />
      <Typography>{text}</Typography>
    </Box>
  );
}
