import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { useEffect, useState } from 'react';

import { chattingMessagesVar, userIdVar } from '../..';
import { IChannel, IChannelNotify, IChatting, IUser } from '../../utils/models';
import { Notify } from '../../utils/schemaEnums';
import { GetCurrentChannelResponse } from '../ChannelList/responseModels';
import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import {
  GET_CHANNEL_BANNED_USERS,
  GET_CHANNEL_MUTED_USERS,
  GET_MY_BLACKLIST,
  SUBSCRIBE_CHANNEL,
} from './gqls';
import ParticipantsList from './ParticipantsList';
import {
  GetChannelBannedUsers,
  GetChannelMutedUsers,
  GetMyBlacklistResponse,
  SubscribeChannelResponse,
} from './responseModels';

interface ChannelProps {
  channel: IChannel;
  channelRefetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<GetCurrentChannelResponse>>;
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
    bannedUsers,
    mutedUsers,
  } = channel;

  const { data: subscribeData } = useSubscription<SubscribeChannelResponse>(
    SUBSCRIBE_CHANNEL,
    { variables: { channel_id: id } }
  );

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
    if (!subscribeData || !subscribeData.subscribeChannel) return; // TODO: 임시 조치... 어떻게 들어오는지 확인 후 수정 필요

    const { type, participant, text, check }: IChannelNotify =
      subscribeData.subscribeChannel;

    const subscribe_id = new Date().getTime().toString();

    console.log(type, participant, text, check);

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
        break;
      case Notify.MUTE:
        if (check) {
          setMuteList([...muteList, (participant as IUser).id]);
          setAlertMsg(
            `MUTE: User '${(participant as IUser).nickname}' is muted.`
          );
          setTimeout(() => {
            setAlertMsg(null);
          }, 3000);
        } else {
          setMuteList(
            muteList.filter((val) => val !== (participant as IUser).id)
          );
          setAlertMsg(
            `UNMUTE: User '${(participant as IUser).nickname}' is unmuted.`
          );
          setTimeout(() => {
            setAlertMsg(null);
          }, 3000);
        }
        break;
      case Notify.BAN:
        // TODO: ban 백엔드 함수가 에러가 나서 아직 구현하지 못하는 상태
        setAlertMsg('BAN: ...');
        setTimeout(() => {
          setAlertMsg(null);
        }, 3000);
        break;
      case Notify.ENTER:
        void channelRefetch(); // TODO: 현재는 그냥 refetch하게 구현했지만, 나중에 로컬 캐시에 직접 추가, 제거하게 개선해야!
        break;
    }
  }, [subscribeData]);

  return (
    <>
      <ChannelHeader {...{ id, title, is_private, owner, administrators }} />
      <ParticipantsList {...{ id, participants }} />
      <Chatting {...{ id, alertMsg, muteList, blacklistData }} />
    </>
  );
}
