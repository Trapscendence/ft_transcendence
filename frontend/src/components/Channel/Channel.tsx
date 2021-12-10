import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { useEffect, useState } from 'react';

import { chattingMessagesVar } from '../..';
import useSnackbar from '../../hooks/useSnackbar';
import { GET_MY_BLACKLIST, SUBSCRIBE_CHANNEL } from '../../utils/Apollo/gqls';
import {
  IChannel,
  IChannelNotify,
  IChatting,
  IUser,
} from '../../utils/Apollo/models';
import {
  GetMyBlacklistResponse,
  GetMyChannelResponse,
  SubscribeChannelResponse,
} from '../../utils/Apollo/responseModels';
import { Notify } from '../../utils/Apollo/schemaEnums';
import ErrorAlert from '../commons/ErrorAlert';
import LoadingBackdrop from '../commons/LoadingBackdrop';
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

  const [alertMsg, displayAlertMsg] = useSnackbar(3000);
  const [umounted, setUnmounted] = useState(false);

  useEffect(() => {
    return () => setUnmounted(true);
  }, []); // NOTE: "Can't perform a React state update on an unmounted component." 에러 임시로 이렇게 해결

  const {
    data: blacklistData,
    error: blacklistError,
    loading: blacklistLoading,
  } = useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST);

  const { data: subscribeData, error: subscribeError } =
    useSubscription<SubscribeChannelResponse>(SUBSCRIBE_CHANNEL, {
      variables: { channel_id: id },
    });

  useEffect(() => {
    if (umounted) return;
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
          displayAlertMsg(
            `MUTE: User '${(participant as IUser).nickname}' is muted.`
          );
          void channelRefetch(); // TODO: 현재는 그냥 refetch하게 구현했지만, 나중에 로컬 캐시에 직접 추가하는 식으로 추후 개선 가능
        } else {
          displayAlertMsg(
            `UNMUTE: User '${(participant as IUser).nickname}' is unmuted.`
          );
          void channelRefetch();
        }
        break;
      case Notify.KICK:
        displayAlertMsg(
          `KICK: User '${(participant as IUser).nickname}' is kicked.`
        );
        void channelRefetch();
        break;
      case Notify.BAN:
        displayAlertMsg(
          `BAN: User '${(participant as IUser).nickname}' is banned.`
        );
        void channelRefetch();
        break;
      case Notify.ENTER:
        displayAlertMsg(
          `ENTER: User '${(participant as IUser).nickname}' enter.`
        );
        void channelRefetch();
        break;
      case Notify.EDIT:
        void channelRefetch();
        break;
      case Notify.TRANSFER:
        void channelRefetch();
        break;
    }
  }, [subscribeData]);

  const errorVar = blacklistError || subscribeError;

  if (blacklistLoading) return <LoadingBackdrop loading={blacklistLoading} />;

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
