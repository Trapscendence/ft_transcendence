import {
  makeVar,
  useQuery,
  useReactiveVar,
  useSubscription,
} from '@apollo/client';
// import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  DmsData,
  DmVars,
  Message,
  RecieveMessageData,
} from '../../utils/Apollo/Message';
import { GET_DM, RECEIVE_MESSAGE } from '../../utils/Apollo/MessageQuery';
import DMContentBox from './DmContentBox';
import SendNewMessage from './SendNewMessage';

interface DirectMessageContentProps {
  user_id: string;
  other_id: string;
  scroll_ref: React.MutableRefObject<HTMLDivElement | null>;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
}

export default function DirectMessageContent({
  user_id,
  other_id,
  scroll_ref,
  offset,
  setOffset,
}: DirectMessageContentProps): JSX.Element {
  const limit = 5;
  const handleClick = () => {
    GetDm();
    setOffset(offset + limit);
  };

  const [cachedDms, setCachedDms] = useState<Message[]>();
  const { data, loading, error } = useQuery<DmsData, DmVars>(GET_DM, {
    //NOTE 최신 0번째부터 4개만 가져옴
    variables: {
      user_id: user_id,
      other_id: other_id,
      offset: offset,
      limit: limit,
    },
  });
  function GetDm(): void {
    //ANCHOR 초회 DM 데이터 가져오기----------------------------------
    console.log(data);
    function handleCacheDm(messages: Message[]): Message[] {
      if (cachedDms != undefined) return [...messages, ...cachedDms];
      return messages;
    }
    // useEffect(() => {
    if (data && data?.DM?.messages != undefined)
      setCachedDms(handleCacheDm(data.DM.messages));
    // }, [data]);
  }
  // //ANCHOR latestDM 가져오기 -------------------------------------

  // const { data: subscriptionData } = useSubscription<
  //   RecieveMessageData,
  //   { user_id: string }
  // >(RECEIVE_MESSAGE, {
  //   variables: { user_id: user_id },
  // });

  // useEffect(() => {
  //   if (subscriptionData?.receiveMessage) {
  //     setCachedDms(handleCacheDm([subscriptionData.receiveMessage]));
  //   }
  // }, [subscriptionData]);

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
        {/* NOTE 초회: 기존 DM 보여주기, 이후: latestDM받아와서 보여주기
        TODO (contentBox를 부르는 상위함수 하나를 만들어서, 초회에만 usequery, 이후에는 latestDM 사용하도록하기) 
        TODO TIMESTAMP로 알아서 정렬해서 출력하세요.. ^^ */}
        {cachedDms && cachedDms != undefined ? (
          cachedDms?.map((message) => (
            //TODO DMCONTENTBOX가 시간순으로 정렬해서 출력하게 하기
            <DMContentBox
              content={message?.content}
              received={message?.received}
              time_stamp={message?.time_stamp}
            />
          ))
        ) : (
          // <div />
          <Typography variant="body2" component="div">
            새로운 대화의 시작입니다.
          </Typography>
        )}{' '}
        <Box id="scroll-container" ref={scroll_ref} />
      </Box>
      <Divider light />
      <SendNewMessage {...{ user_id, other_id, scroll_ref }} />
    </Box>
  );
}
