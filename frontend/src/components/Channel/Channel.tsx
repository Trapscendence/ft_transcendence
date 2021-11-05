import { useQuery, useReactiveVar, useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { Redirect } from 'react-router';

import { channelIdVar, chattingMessagesVar, userIdVar } from '../..';
import { ChannelNotifySummary, ChattingSummary } from '../../utils/models';
import { Notify } from '../../utils/schemaEnums';
import { GET_CURRENT_CHANNEL } from '../ChannelList/gqls';
import { GetCurrentChannelResponse } from '../ChannelList/responseModels';
import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import { SUBSCRIBE_CHANNEL } from './gqls';
import ParticipantsList from './ParticipantsList';
import { SubscribeChannelResponse } from './responseModels';

export default function Channel(): JSX.Element {
  const channelId = useReactiveVar(channelIdVar);

  const { data: channelData } = useQuery<GetCurrentChannelResponse>(
    GET_CURRENT_CHANNEL,
    { variables: { id: userIdVar() } }
  );
  const { data: subscribeData } = useSubscription<SubscribeChannelResponse>(
    SUBSCRIBE_CHANNEL,
    { variables: { channel_id: channelIdVar() } }
  );

  useEffect(() => {
    if (!subscribeData || !subscribeData.subscribeChannel) return; // TODO: 임시 조치... 어떻게 들어오는지 확인 후 수정 필요

    const { type, participant, text, check }: ChannelNotifySummary =
      subscribeData.subscribeChannel;

    console.log(type);

    const id = new Date().getTime().toString();

    switch (type) {
      case Notify.CHAT:
        if (participant && text) {
          let prev: ChattingSummary[] | undefined = chattingMessagesVar().get(
            channelIdVar() as string // TODO: 임시 조치... 이렇게 해도 될까...?
          );

          if (!prev) {
            prev = [];
          }

          const duplicatedMap = new Map(chattingMessagesVar());
          duplicatedMap.set(channelIdVar() as string, [
            ...prev,
            { id, participant, text },
          ]);

          console.log(duplicatedMap);
          chattingMessagesVar(duplicatedMap);
        }
    }
  }, [subscribeData]);

  if (!channelData) return <div>???</div>;

  if (!channelId) {
    // history.push(`/channel`);
    return <Redirect to="/channel" />; // TODO: 차이가 뭐지?
  } // TODO: channelID 때문에 얼리리턴 했는데... 괜찮은걸까? 훅 앞에 얼리리턴 하면 안된다고 했었는데, useQuery 등도 훅 아닌가?

  return (
    <>
      <ChannelHeader channelData={channelData} />
      {/* <ParticipantsList notify={subscribeData?.subscribeChannel} /> */}
      <ParticipantsList channelData={channelData} />
      {/* <Chatting notify={subscribeData?.subscribeChannel} /> */}
      <Chatting />
    </>
  );
}
