// import { useReactiveVar } from '@apollo/client';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

// import { chattingMessagesVar } from '../../..';
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
      <UserSummary nickname={participant.nickname} />
      <Typography>{text}</Typography>
    </Box>
  );
}
