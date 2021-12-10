import { useMutation } from '@apollo/client';
// import { Send } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { SendMessageData } from '../../utils/Apollo/Message';
import { SEND_MESSAGE } from '../../utils/Apollo/MessageQuery';
//ANCHOR 새로운 DM 보내기

interface SendNewMessageContentProps {
  other_id: string;
  scroll_ref: React.MutableRefObject<HTMLDivElement | null>;
  handleClick: () => void;
}

export default function SendNewMessage({
  other_id,
  scroll_ref,
  handleClick,
}: SendNewMessageContentProps): JSX.Element {
  const scrollToBottom = () => scroll_ref?.current?.scrollIntoView();
  useEffect(() => {
    scrollToBottom();
  });

  const [form, setForm] = useState('');
  //TODO 센드 하고나면 프론트가 알아서 새로고침하기
  const [sendMessageMutation, { loading }] = useMutation<SendMessageData>(
    SEND_MESSAGE

    // {
    //   //여기의 data는 sendMessageMutation의 내부쿼리임!
    //   update(cache, { data }) {
    //     // 1. 보낸 메시지를 가져온다
    //     const newMessage = data?.sendMessage;

    //     console.log(`NEWMESSAGE:`, newMessage);
    //     const existingMessages = cache.readQuery<DmsData, DmVars>({
    //       // 2. 현재 캐시에 저장되어있는 데이터를 가져온다.
    //       query: GET_DM,
    //       variables: {
    //         user_id: user_id,
    //         other_id: other_id,
    //         offset: 0,
    //         limit: 5,
    //       },
    //     });
    //   console.log(`OLDMESSAGE:`, existingMessages);

    //   if (newMessage && existingMessages) {
    //     cache.writeQuery<DmsData, DmVars>({
    //       // 캐시 업데이트!
    //       query: GET_DM,
    //       variables: {
    //         user_id: user_id,
    //         other_id: other_id,
    //         offset: 0,
    //         limit: 5,
    //       },
    //       data: {
    //         DM: {
    //           ...existingMessages.DM,
    //           messages: [...existingMessages.DM.messages, newMessage],
    //           // 3. 현재 캐시에 저장되어있는 messages에 새로운 message를 추가해준다.
    //         },
    //       },
    //     });
    //   }
    // },
    // }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loading) {
      try {
        await sendMessageMutation({
          variables: {
            other_id: other_id,
            text: form,
          },
          //TODO 센드누른이후 새로고침해주기
          /* refetchQueries 사용가능
          
            const [deleteTask] = useMutation(DELETE_TASK, {
              refetchQueries: [GET_TASKS],
            });*/
        }).then(() => {
          handleClick();
          // setLoadingState(true);
          scrollToBottom();
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
        // onClick={handleClick}
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
