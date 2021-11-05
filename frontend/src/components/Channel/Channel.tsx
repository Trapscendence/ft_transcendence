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
  const userId = useReactiveVar(userIdVar);
  const chattingMessages = useReactiveVar(chattingMessagesVar);

  if (!channelId) {
    // history.push(`/channel`);
    return <Redirect to="/channel" />;
  }

  const { data: channelData } = useQuery<GetCurrentChannelResponse>(
    GET_CURRENT_CHANNEL,
    { variables: { id: userId } }
  );
  const { data: subscribeData } = useSubscription<SubscribeChannelResponse>(
    SUBSCRIBE_CHANNEL,
    { variables: { channel_id: channelId } }
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
          let prev: ChattingSummary[] | undefined =
            chattingMessages.get(channelId);

          if (!prev) {
            prev = [];
          }

          const duplicatedMap = new Map(chattingMessages);
          duplicatedMap.set(channelId, [...prev, { id, participant, text }]);

          console.log(duplicatedMap);
          chattingMessagesVar(duplicatedMap);
        }
    }
  }, [subscribeData]);

  if (!channelData) return <div>???</div>;

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
