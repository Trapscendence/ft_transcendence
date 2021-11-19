import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { useEffect, useState } from 'react';

import { chattingMessagesVar } from '../..';
import { GET_MY_BLACKLIST, SUBSCRIBE_CHANNEL } from '../../utils/gqls';
import { IChannel, IChannelNotify, IChatting, IUser } from '../../utils/models';
import {
  GetMyBlacklistResponse,
  GetMyChannelResponse,
  SubscribeChannelResponse,
} from '../../utils/responseModels';
import { Notify } from '../../utils/schemaEnums';
import ErrorAlert from '../commons/ErrorAlert';
import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import ParticipantsList from './ParticipantsList';

interface ChannelProps {
  channel: IChannel;
  channelRefetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<GetMyChannelResponse>>;
}

export default function Channel({
  channel,
  channelRefetch,
}: ChannelProps): JSX.Element {
  const {
    id,
    title,
    is_private,
    owner,
    administrators,
    participants,
    // banned_users, // NOTE: 나중에 Channel 세팅 구현되면, banned_users 필요할 것
    muted_users,
  } = channel;

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const { data: blacklistData, error: blacklistError } =
    useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST);

  const { data: subscribeData, error: subscribeError } =
    useSubscription<SubscribeChannelResponse>(SUBSCRIBE_CHANNEL, {
      variables: { channel_id: id },
    });

  const displayAlertMsg = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, 3000);
  };

  useEffect(() => {
    if (!subscribeData) return; // NOTE: undefined 방지를 위해

    const { type, participant, text, check }: IChannelNotify =
      subscribeData.subscribeChannel;

    console.log(type, participant, text, check);

    // TODO: switch 개선 가능
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
            { id: new Date().getTime().toString(), participant, text },
          ]);

          chattingMessagesVar(duplicatedMap);
        }
        break;
      case Notify.MUTE:
        if (check) {
          void channelRefetch(); // TODO: 현재는 그냥 refetch하게 구현했지만, 나중에 로컬 캐시에 직접 추가하는 식으로 추후 개선 가능
          displayAlertMsg(
            `MUTE: User '${(participant as IUser).nickname}' is muted.`
          );
        } else {
          void channelRefetch();
          displayAlertMsg(
            `UNMUTE: User '${(participant as IUser).nickname}' is unmuted.`
          );
        }
        break;
      case Notify.KICK:
        void channelRefetch();
        displayAlertMsg(
          `KICK: User '${(participant as IUser).nickname}' is kicked.`
        );
        break;
      case Notify.BAN:
        void channelRefetch();
        displayAlertMsg(
          `BAN: User '${(participant as IUser).nickname}' is banned.`
        );
        break;
      case Notify.ENTER:
        void channelRefetch();
        displayAlertMsg(
          `ENTER: User '${(participant as IUser).nickname}' enter.`
        );
        break;
      case Notify.EDIT:
        void channelRefetch();
        break;
    }
  }, [subscribeData]);

  const errorVar = blacklistError || subscribeError;

  if (!blacklistData) return <></>;

  return (
    <>
      {errorVar && <ErrorAlert name="Channel" error={errorVar} />}
      <ChannelHeader {...{ id, title, is_private, owner, administrators }} />
      <ParticipantsList {...{ id, participants }} />
      <Chatting
        {...{
          id,
          alertMsg,
          muted_users,
          blacklistData,
        }}
      />
    </>
  );
}
