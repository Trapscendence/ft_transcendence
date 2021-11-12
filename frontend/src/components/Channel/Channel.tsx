import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { useEffect, useState } from 'react';

import { chattingMessagesVar, userIdVar } from '../..';
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
    // bannedUsers,
    mutedUsers,
  } = channel;

  const { data: subscribeData, error: subscribeError } =
    useSubscription<SubscribeChannelResponse>(SUBSCRIBE_CHANNEL, {
      variables: { channel_id: id },
    });

  const { data: blacklistData } = useQuery<GetMyBlacklistResponse>(
    GET_MY_BLACKLIST,
    {
      variables: { id: userIdVar() },
    }
  );

  // const {data: mutedUsersList} = useQuery<GetChannelMutedUsers>(GET_CHANNEL_MUTED_USERS);
  // const {data: bannedUsersList} = useQuery<GetChannelBannedUsers>(GET_CHANNEL_BANNED_USERS);

  // useEffect(()=>{

  // }, [bannedUsers]);

  useEffect(() => {
    // console.log(mutedUsers); // TODO: 현재 mutedUsers가 안들어오는 이슈!
    setMuteList(mutedUsers.map((val) => val.id));
  }, [mutedUsers]);

  const [muteList, setMuteList] = useState<string[]>([]);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!subscribeData) return; // NOTE: undefined 방지를 위해

    const { type, participant, text, check }: IChannelNotify =
      subscribeData.subscribeChannel;

    // console.log(type, participant, text, check);

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
          void channelRefetch();
          // setMuteList([...muteList, (participant as IUser).id]);
          setAlertMsg(
            `MUTE: User '${(participant as IUser).nickname}' is muted.`
          );
          setTimeout(() => {
            setAlertMsg(null);
          }, 3000);
        } else {
          void channelRefetch();
          // setMuteList(
          //   muteList.filter((val) => val !== (participant as IUser).id)
          // );
          setAlertMsg(
            `UNMUTE: User '${(participant as IUser).nickname}' is unmuted.`
          );
          setTimeout(() => {
            setAlertMsg(null);
          }, 3000);
        }
        break;
      case Notify.KICK:
        setAlertMsg(
          `BAN: User '${(participant as IUser).nickname}' is banned.`
        );
        setTimeout(() => {
          setAlertMsg(null);
        }, 3000); // NOTE: kick은 ban할 때만 사용, kick 성공한 사람만 문구 뜨도록
        void channelRefetch();
        break;
      case Notify.ENTER:
        void channelRefetch(); // TODO: 현재는 그냥 refetch하게 구현했지만, 나중에 로컬 캐시에 직접 추가, 제거하게 개선할 수...
        break;
    }
  }, [subscribeData]);

  if (subscribeError) {
    console.log(subscribeError);
    return <ErrorAlert name="Channel: subscribeError" error={subscribeError} />;
  }

  return (
    <>
      <ChannelHeader {...{ id, title, is_private, owner, administrators }} />
      <ParticipantsList {...{ id, participants }} />
      <Chatting {...{ id, alertMsg, muteList, blacklistData }} />
    </>
  );
}
