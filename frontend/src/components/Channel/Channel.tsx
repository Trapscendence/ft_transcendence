import { useQuery, useReactiveVar, useSubscription } from '@apollo/client';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';

import { chattingMessagesVar, userIdVar } from '../..';
import {
  ChannelNotifySummary,
  ChannelSummary,
  ChattingSummary,
} from '../../utils/models';
import { Notify } from '../../utils/schemaEnums';
import {
  GET_CURRENT_CHANNEL,
  GET_CURRENT_CHANNEL_ID,
} from '../ChannelList/gqls';
import {
  GetCurrentChannelIdResponse,
  GetCurrentChannelResponse,
} from '../ChannelList/responseModels';
import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import { SUBSCRIBE_CHANNEL } from './gqls';
import ParticipantsList from './ParticipantsList';
import { SubscribeChannelResponse } from './responseModels';

interface ChannelProps {
  channel: ChannelSummary;
}

export default function Channel({ channel }: ChannelProps): JSX.Element {
  const { id, title, is_private, owner, administrators, participants } =
    channel;

  // const history = useHistory();

  const { data: subscribeData } = useSubscription<SubscribeChannelResponse>(
    SUBSCRIBE_CHANNEL,
    { variables: { channel_id: id } }
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
            id // TODO: 임시 조치... 이렇게 해도 될까...?
          );

          if (!prev) {
            prev = [];
          }

          const duplicatedMap = new Map(chattingMessagesVar());
          duplicatedMap.set(id, [...prev, { id, participant, text }]);

          console.log(duplicatedMap);
          chattingMessagesVar(duplicatedMap);
        }
    }
  }, [subscribeData]);

  return (
    <>
      <ChannelHeader {...{ title, is_private, owner, administrators }} />
      {/* <ParticipantsList notify={subscribeData?.subscribeChannel} /> */}
      {/* <ParticipantsList channelData={channelData} /> */}
      {/* <Chatting notify={subscribeData?.subscribeChannel} /> */}
      <Chatting />
    </>
  );
}
