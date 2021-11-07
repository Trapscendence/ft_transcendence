import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';

import { chattingMessagesVar } from '../..';
import { IChannel, IChannelNotify, IChatting } from '../../utils/models';
import { Notify } from '../../utils/schemaEnums';
import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import { SUBSCRIBE_CHANNEL } from './gqls';
import ParticipantsList from './ParticipantsList';
import { SubscribeChannelResponse } from './responseModels';

interface ChannelProps {
  channel: IChannel;
}

export default function Channel({ channel }: ChannelProps): JSX.Element {
  const { id, title, is_private, owner, administrators, participants } =
    channel;

  const { data: subscribeData } = useSubscription<SubscribeChannelResponse>(
    SUBSCRIBE_CHANNEL,
    { variables: { channel_id: id } }
  );

  useEffect(() => {
    if (!subscribeData || !subscribeData.subscribeChannel) return; // TODO: 임시 조치... 어떻게 들어오는지 확인 후 수정 필요

    const { type, participant, text, check }: IChannelNotify =
      subscribeData.subscribeChannel;

    const subscribe_id = new Date().getTime().toString();

    switch (type) {
      case Notify.CHAT:
        if (participant && text) {
          let prev: IChatting[] | undefined = chattingMessagesVar().get(id);

          if (!prev) {
            prev = [];
          }

          const duplicatedMap = new Map(chattingMessagesVar());
          duplicatedMap.set(id, [
            ...prev,
            { id: subscribe_id, participant, text },
          ]);

          chattingMessagesVar(duplicatedMap);
        }
    }
  }, [subscribeData]);

  return (
    <>
      <ChannelHeader {...{ id, title, is_private, owner, administrators }} />
      <ParticipantsList {...{ participants }} />
      <Chatting {...{ id }} />
    </>
  );
}
