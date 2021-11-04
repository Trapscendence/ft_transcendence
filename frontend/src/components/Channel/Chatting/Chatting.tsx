import { useMutation, useReactiveVar } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';

import { channelIdVar, chattingMessagesVar, userIdVar } from '../../..';
import { useInput } from '../../../hooks/useInput';
import { ChannelNotifySummary } from '../../../utils/models';
import { CHAT_MESSAGE } from '../gqls';
import ChattingMessage from './ChattingMessage';

interface ChattingProps {
  notify: ChannelNotifySummary | undefined;
}

export default function Chatting({ notify }: ChattingProps): JSX.Element {
  const [input, setInput, onChangeInput] = useInput('');
  const [chatMessage] = useMutation(CHAT_MESSAGE);

  const userId = useReactiveVar(userIdVar);
  // const currentChannel = useReactiveVar(currentChannelVar);
  const chattingMessages = useReactiveVar(chattingMessagesVar);
  const channelId = useReactiveVar(channelIdVar);

  const onClickBtn = () => {
    // console.log(input);
    void chatMessage({
      variables: {
        message: input,
        user_id: userId,
        channel_id: channelId,
      },
    }); // TODO: void를 안쓰면 에러가 뜬다... 뭐지?
    setInput('');
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '79vh', p: 2 }}>
      <CardContent sx={{ height: '90%' }}>
        <Box>
          {/* {channelId &&
            chattingMessages
              .get(channelId)
              ?.map((val) => (
                <ChattingMessage key={+new Date()} chattingSummary={val} />
              ))} */}
        </Box>
      </CardContent>
      <CardActions sx={{ width: '100%', height: '10%' }}>
        <TextField
          label="message"
          variant="filled"
          size="small"
          sx={{ width: '100%', mr: 2 }}
          value={input}
          onChange={onChangeInput}
        />
        <Button variant="contained" onClick={onClickBtn}>
          Send
        </Button>
      </CardActions>
    </Card>
  );
}

// TODO: 85vh, 90% 이런식으로 말고 더 나은 방법은 없을까?
// TODO: 90%, 10% 이런거 너무 마음에 안드는데...
