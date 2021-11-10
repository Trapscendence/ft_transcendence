import { useMutation, useReactiveVar } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

import { channelIdVar, chattingMessagesVar, userIdVar } from '../../..';
import { useInput } from '../../../hooks/useInput';
import { CHAT_MESSAGE } from '../gqls';
import { GetMyBlacklistResponse } from '../responseModels';
import ChattingMessage from './ChattingMessage';

interface ChattingProps {
  id: string;
  alertMsg: string | null;
  muteList: string[];
  blacklistData: GetMyBlacklistResponse | undefined;
}

export default function Chatting({
  id,
  alertMsg,
  muteList,
  blacklistData,
}: ChattingProps): JSX.Element {
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

  const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      void chatMessage({
        variables: {
          message: input,
          user_id: userIdVar(),
          channel_id: id,
        },
      });
      setInput('');
    }
  };

  const {
    user: { blacklist },
  } = blacklistData as GetMyBlacklistResponse;

  console.log(blacklist);

  console.log(blacklistData);

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '72vh', p: 2 }}>
      <CardContent sx={{ height: '90%', position: 'relative' }}>
        {alertMsg && (
          <Alert
            severity="info"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, 0)',
              zIndex: 1,
            }}
          >
            {alertMsg}
          </Alert>
        )}
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
          {chattingMessages.get(id)?.map((val) => {
            // if (
            //   blacklist.find((blacked) => blacked.id === val.participant.id)
            // ) {
            //   return (
            //     <Alert severity="error" sx={{ m: 1 }} key={val.id}>
            //       Message from a blacked user.
            //     </Alert>
            //   );
            // }

            if (muteList.find((muted) => muted === val.participant.id)) {
              return (
                <Alert severity="error" sx={{ m: 1 }} key={val.id}>
                  Message from a muted user.
                </Alert>
              );
            } // TODO: 배열을 순회하므로 조금 비효율적...

            return (
              <ChattingMessage key={val.id} IChatting={val} channelId={id} />
            );
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
          onKeyPress={onKeyPress}
          disabled={muted}
        />
        <Button variant="contained" onClick={onClickBtn} disabled={muted}>
          Send
        </Button>
      </CardActions>
    </Card>
  );
}

// TODO: 85vh, 90% 이런식으로 말고 더 나은 방법은 없을까?
