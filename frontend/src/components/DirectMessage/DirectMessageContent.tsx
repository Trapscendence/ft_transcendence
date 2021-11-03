import { useMutation, useQuery } from '@apollo/client';
import { Send } from '@mui/icons-material';
// import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { DmsData, DmVars } from '../../utils/Apollo/Message';
import { GET_DM, SEND_MESSAGE } from '../../utils/Apollo/MessageQuery';

interface DirectMessageContentProps {
  user_id: string;
  other_id: string;
  scroll_ref: React.MutableRefObject<HTMLDivElement | null>;
}

function DirectMessageContent({
  user_id,
  other_id,
  scroll_ref,
}: DirectMessageContentProps): JSX.Element {
  const friendDmStyle = {
    background: '#262626',
    borderRadius: '0.1rem 0.9rem 0.9rem 0.9rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  };

  const myDmStyle = {
    backgroundAttachment: 'fixed',
    background: ' rgba(103, 88, 205, 1)',
    borderRadius: '0.9rem 0.9rem 0.1rem 0.9rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  };

  const scrollToBottom = () => scroll_ref?.current?.scrollIntoView();
  useEffect(() => {
    scrollToBottom();
  });
  const [loadingState, setLoadingState] = useState(false);
  const handleClick = () => {
    setLoadingState(true);
    scrollToBottom();
  };

  const { data } = useQuery<DmsData, DmVars>(GET_DM, {
    variables: { user_id: user_id, other_id: other_id, offset: 0, limit: 10 },
  });

  //ANCHOR 새로운 DM 보내기
  const [sendMessageMutation, { loading }] = useMutation(SEND_MESSAGE);
  const [form, setForm] = useState('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(form);
    if (!loading) {
      try {
        await sendMessageMutation({
          // const { user_id } = getValues();
          //ANCHOR 매번 유저정보 가져오게 수정하기
          variables: {
            user_id: user_id,
            other_id: other_id,
            text: form,
          },
          //ANCHOR 센드누른이후 새로고침해주기
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end'
      }}
    >
      <Box
        id="content-container"
        sx={{
          overflowY: 'scroll',
        }}
        // ref={messagesEndRef}
      >
        {data?.DM?.messages != undefined &&
          data.DM.messages.map((message) =>
            message.received ? (
              <Stack
                // direction="row"
                // justifyContent="flex-start"
                justifyContent="flex-end"
                spacing={0}
              >
                <Box id="friend-DM" style={friendDmStyle}>
                  {message.content}
                </Box>
                <Typography variant="caption" display="block" gutterBottom>
                  {new Date(+message?.time_stamp).toLocaleString('ko-KR')}
                </Typography>
              </Stack>
            ) : (
              <Box
                id="mine-DM"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Box style={myDmStyle}>{message.content}</Box>
                <Typography variant="caption" display="block" gutterBottom>
                  {new Date(+message?.time_stamp).toLocaleString('ko-kr', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            )
          )}
        <Box id="scroll-container" ref={scroll_ref} />
      </Box>

      <Divider light />
      <form
        id="send-container"
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'space-between',
          justifyContent: 'space-between',
          bottom: '0',
        }}
      >
        <TextField
          name="dmInput"
          size="small"
          fullWidth
          margin="dense"
          onChange={(e) => {
            setForm(e.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={handleClick}
          // endIcon={<Send />}
          // loading={loadingState}
          // loadingPosition="end"
          variant="contained"
          sx={{
            boxShadow: 0,
            margin: '5px 0px 5px 8px',
          }}
        >
          Send
        </Button>
      </form>
    </Box>
  );
}

export default DirectMessageContent;
