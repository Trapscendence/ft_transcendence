/* eslint-disable */

import {
  useMutation,
  useLazyQuery,
  useQuery,
  useSubscription,
} from '@apollo/client';
// import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  DmsData,
  DmVars,
  Message,
  ReceiveMessageData,
} from '../../utils/Apollo/Message';
import {
  GET_DM,
  RECEIVE_MESSAGE,
  UPDATE_CHECK_DATE,
} from '../../utils/Apollo/MessageQuery';
import DMContentBox from './DmContentBox';
import SendNewMessage from './SendNewMessage';

interface DirectMessageContentProps {
  other_id: string;
  scroll_ref: React.MutableRefObject<HTMLDivElement | null>;
  // offset: number;
  // setOffset: React.Dispatch<React.SetStateAction<number>>;
}

export default function DirectMessageContent({
  other_id,
  scroll_ref,
}: // offset,
// setOffset,
DirectMessageContentProps): JSX.Element {
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  //NOTE offset이 바뀌어서 usequery가 실행되는거고... useQuery는 원래 한번만 실행된다...(헐...)
  const { data, subscribeToMore } = useQuery<DmsData, DmVars>(GET_DM, {
    variables: {
      other_id: other_id,
      offset: offset,
      limit: limit,
    },
  });

  useEffect(() => {
    setOffset(0);
    setLimit(10);
  }, [other_id]);

  const handleClick = () => {
    setOffset(0);
    setLimit(limit + 1);
    console.log(offset, limit);
  };
  //ANCHOR latestDM 가져오기 -------------------------------------
  const [updateCheckdate] =
    useMutation<{ other_id: string }>(UPDATE_CHECK_DATE);

  useEffect(() => {
    if (data?.DM?.messages) {
      updateCheckdate({
        variables: {
          other_id: other_id,
        },
      });
      subscribeToMore({
        document: RECEIVE_MESSAGE,
        variables: {
          other_id: other_id,
          offset: offset,
          limit: limit,
        },

        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: ReceiveMessageData } }
        ) => {
          const newDmItem = data?.receiveMessage;
          if (!data) {
            return prev;
          }
          // console.log(`PREV:`, prev);
          // console.log(`DATA:`, data);
          return Object.assign({}, prev, {
            // ...prev,
            //TODO 새 쪽지 왔을 때 양식 수정
            DM: {
              messages: [...prev?.DM?.messages, newDmItem],
            },
          });
        },
      });
    }
  }, [data]);

  // const { data: subScriptionData } = useSubscription(RECEIVE_MESSAGE, {
  //   variables: {
  //     user_id: user_id,
  //     other_id: other_id,
  //     offset: 0,
  //     limit: 10,
  //   },
  // });

  // useEffect(() => {
  //   [...subScriptionData, ...data];
  //   console.log(data);
  // }, [subScriptionData]);

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
      <Button
        onClick={() => handleClick()}
        variant="contained"
        sx={{
          boxShadow: 0,
          margin: '5px 0px 5px 8px',
        }}
      />

      <Box
        id="content-container"
        sx={{
          overflowY: 'scroll',
        }}
      >
        {data && data.DM != undefined ? (
          data?.DM.messages.map((message) => {
            //TODO DMCONTENTBOX가 시간순으로 정렬해서 출력하게 하기
            return (
              <DMContentBox
                content={message?.content}
                received={message?.received}
                time_stamp={message?.time_stamp}
                key={message?.time_stamp}
              />
            );
          })
        ) : (
          <div />
        )}
        <Box id="scroll-container" ref={scroll_ref} />
      </Box>
      <Divider light />
      <SendNewMessage {...{ other_id, scroll_ref, handleClick }} />
    </Box>
  );
}
