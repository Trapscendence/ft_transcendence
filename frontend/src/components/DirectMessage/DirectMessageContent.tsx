import { useQuery, useSubscription } from '@apollo/client';
// import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { DmsData, DmVars, Message } from '../../utils/Apollo/Message';
import { GET_DM, RECEIVE_MESSAGE } from '../../utils/Apollo/MessageQuery';
import DMContentBox from './DmContentBox';
import SendNewMessage from './SendNewMessage';

export interface DirectMessageContentProps {
  user_id: string;
  other_id: string;
  scroll_ref: React.MutableRefObject<HTMLDivElement | null>;
}

export function DirectMessageContent({
  user_id,
  other_id,
  scroll_ref,
}: DirectMessageContentProps): JSX.Element {
  function GetDM(): JSX.Element {
    const Dms: Message[] = [];
    //ANCHOR 초회 DM 데이터 가져오기----------------------------------
    const { data } = useQuery<DmsData, DmVars>(GET_DM, {
      //NOTE 최신 0번째부터 4개만 가져옴
      variables: { user_id: user_id, other_id: other_id, offset: 0, limit: 4 },
    });
    if (data && data?.DM?.messages != undefined)
      data.DM.messages.map((message) => Dms.push(message));

    //ANCHOR latestDM 가져오기 -------------------------------------
    const { data: subscriptionData } = useSubscription<
      Message,
      { user_id: string }
    >(RECEIVE_MESSAGE, {
      variables: { user_id: user_id },
    });

    useEffect(() => {
      console.log(subscriptionData);
      if (subscriptionData) {
        Dms.push(subscriptionData);
      }
    }, [subscriptionData]);

    console.log(`DMS:`, Dms);

    if (Dms && Dms != undefined)
      return (
        <div>
          {Dms.map((message) => (
            //TODO DMCONTENTBOX가 시간순으로 정렬해서 출력하게 하기
            <DMContentBox
              content={message?.content}
              received={message?.received}
              time_stamp={message?.time_stamp}
            />
          ))}
        </div>
      );
    else
      return (
        <Typography variant="body2" component="div">
          새로운 대화의 시작입니다.
        </Typography>
      );
  }

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
      >
        {/* NOTE 초회: 기존 DM 보여주기, 이후: latestDM받아와서 보여주기
        TODO (contentBox를 부르는 상위함수 하나를 만들어서, 초회에만 usequery, 이후에는 latestDM 사용하도록하기) 
        TODO TIMESTAMP로 알아서 정렬해서 출력하세요.. ^^ */}
        <GetDM />
        <Box id="scroll-container" ref={scroll_ref} />
      </Box>
      <Divider light />
      <SendNewMessage {...{ user_id, other_id, scroll_ref }} />
    </Box>
  );
}
