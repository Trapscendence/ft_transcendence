import { useMutation, useReactiveVar } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef } from 'react';

import { chattingMessagesVar, userIdVar } from '../../..';
import { useInput } from '../../../hooks/useInput';
import { CHAT_MESSAGE } from '../gqls';
import ChattingMessage from './ChattingMessage';

interface ChattingProps {
  id: string;
}

export default function Chatting({ id }: ChattingProps): JSX.Element {
  const [input, setInput, onChangeInput] = useInput('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const chattingMessages = useReactiveVar(chattingMessagesVar);

  const [chatMessage] = useMutation(CHAT_MESSAGE);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chattingMessages]);

  const onClickBtn = () => {
    // console.log(input);
    void chatMessage({
      variables: {
        message: input,
        user_id: userIdVar(),
        channel_id: id,
      },
    }); // TODO: void를 안쓰면 에러가 뜬다... 뭐지?
    setInput('');
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '72vh', p: 2 }}>
      <CardContent sx={{ height: '90%' }}>
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
          {chattingMessages.get(id)?.map((val) => {
            return <ChattingMessage key={val.id} IChatting={val} />;
          })}
          <div ref={messagesEndRef} />
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
