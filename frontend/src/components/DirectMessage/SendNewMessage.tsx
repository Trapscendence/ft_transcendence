import { useMutation } from '@apollo/client';
// import { Send } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { SEND_MESSAGE } from '../../utils/Apollo/MessageQuery';
//ANCHOR 새로운 DM 보내기

interface SendNewMessageContentProps {
  user_id: string;
  other_id: string;
  scroll_ref: React.MutableRefObject<HTMLDivElement | null>;
}

export default function SendNewMessage({
  user_id,
  other_id,
  scroll_ref,
}: SendNewMessageContentProps): JSX.Element {
  const scrollToBottom = () => scroll_ref?.current?.scrollIntoView();
  useEffect(() => {
    scrollToBottom();
  });
  const [loadingState, setLoadingState] = useState(false);

  const handleClick = () => {
    setLoadingState(true);
    scrollToBottom();
  };
  const [form, setForm] = useState('');
  //TODO 센드 하고나면 프론트가 알아서 새로고침하기
  const [sendMessageMutation, { loading }] = useMutation(SEND_MESSAGE);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loading) {
      try {
        await sendMessageMutation({
          // const { user_id } = getValues();
          //TODO 매번 유저정보 가져오게 수정하기
          variables: {
            user_id: user_id,
            other_id: other_id,
            text: form,
          },
          //TODO 센드누른이후 새로고침해주기
          /* refetchQueries 사용가능
          
            const [deleteTask] = useMutation(DELETE_TASK, {
              refetchQueries: [GET_TASKS],
            });*/
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
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
  );
}
