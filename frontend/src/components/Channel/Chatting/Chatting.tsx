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

import { chattingMessagesVar, userIdVar } from '../../..';
import { useInput } from '../../../hooks/useInput';
import { CHAT_MESSAGE } from '../../../utils/gqls';
import { IUser } from '../../../utils/models';
import { GetMyBlacklistResponse } from '../../../utils/responseModels';
import ErrorAlert from '../../commons/ErrorAlert';
import ChattingMessage from './ChattingMessage';

interface ChattingProps {
  id: string;
  alertMsg: string | null;
  muted_users: IUser[];
  blacklistData: GetMyBlacklistResponse;
}

export default function Chatting({
  id,
  alertMsg,
  muted_users,
  blacklistData,
}: ChattingProps): JSX.Element {
  const {
    user: { blacklist },
  } = blacklistData;

  const [input, setInput, onChangeInput] = useInput('');
  const [muted, setMuted] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chattingMessages = useReactiveVar(chattingMessagesVar);

  const [chatMessage, { error }] = useMutation(CHAT_MESSAGE);

  useEffect(() => {
    if (muted_users.find((val) => val.id === userIdVar())) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  }, [muted_users]);

  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messagesEndRef.current?.scrollIntoView();
  }, [chattingMessages]);

  const sendInput = async () => {
    try {
      await chatMessage({
        variables: {
          message: input,
          user_id: userIdVar(),
          channel_id: id,
        },
      });
      setInput('');
    } catch (e) {
      console.log(e);
    }
  };

  const onKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      await sendInput();
    }
  };

  return (
    <>
      {error && <ErrorAlert name="Chatting" error={error} />}
      <Card variant="outlined" sx={{ width: '100%', height: '68vh', p: 2 }}>
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
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {chattingMessages.get(id)?.map((val) => {
              if (blacklist.find((black) => black.id === val.participant.id)) {
                return (
                  <Alert severity="error" sx={{ m: 1 }} key={val.id}>
                    Message from a blacklist user.
                  </Alert>
                );
              }

              if (
                muted_users.find((muted) => muted.id === val.participant.id)
              ) {
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
          <Button variant="contained" onClick={sendInput} disabled={muted}>
            Send
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

// TODO: 85vh, 90% 이런식으로 말고 더 나은 방법은 없을까?
