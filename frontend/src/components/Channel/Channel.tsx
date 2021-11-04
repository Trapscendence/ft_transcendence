import { useQuery, useReactiveVar, useSubscription } from '@apollo/client';
import { Redirect, useHistory } from 'react-router';

import { channelIdVar, chattingMessagesVar } from '../..';
import { ChannelNotifySummary, ChattingSummary } from '../../utils/models';
import { Notify } from '../../utils/schemaEnums';
import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import { SUBSCRIBE_CHANNEL } from './gqls';
import ParticipantsList from './ParticipantsList';
import { SubscribeChannelResponse } from './responseModels';

export default function Channel(): JSX.Element {
  const history = useHistory();

  const channelId = useReactiveVar(channelIdVar);

  if (!channelId) {
    // history.push(`/channel`);
    return <Redirect to="/channel" />;
  }

  const chattingMessages = useReactiveVar(chattingMessagesVar);

  const { data } = useSubscription<SubscribeChannelResponse>(
    SUBSCRIBE_CHANNEL,
    {
      variables: { channel_id: channelId },
      onSubscriptionData: ({ subscriptionData: { data } }): void => {
        console.log(data); // TODO: subscribe가 두번 오는 이슈. 백엔드에 여쭤보기!

        // if (!data || !data.subscribeChannel) return;

        // const { type, participant, text, check }: ChannelNotifySummary =
        //   data.subscribeChannel;

        // switch (type) {
        //   case Notify.CHAT:
        //     if (participant && text) {
        //       let prev: ChattingSummary[] | undefined =
        //         chattingMessages.get(channelId);

        //       if (!prev) {
        //         prev = [];
        //       }

        //       const duplicatedMap = new Map(chattingMessages);
        //       duplicatedMap.set(channelId, [...prev, { participant, text }]);

        //       chattingMessagesVar(duplicatedMap);
        //     }
        // }
      },
    }
  );

  return (
    <>
      <ChannelHeader />
      <ParticipantsList notify={data?.subscribeChannel} />
      <Chatting notify={data?.subscribeChannel} />
    </>
  );
}
