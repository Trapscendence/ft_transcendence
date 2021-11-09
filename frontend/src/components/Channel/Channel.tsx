import { useSubscription } from '@apollo/client';
import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';

import { chattingMessagesVar } from '../..';
import { IChannel, IChannelNotify, IChatting, IUser } from '../../utils/models';
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

  // TODO: 새로 들어가거나 온라인 접속했을 때, mute나 ban 목록을 다시 알려줘야 하지 않나?
  // TODO: 프론트와 백에서 어떻게 하기로 했는지가 기억이 잘 안남...

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
    }
  }, [subscribeData]);

  return (
    <>
      <ChannelHeader {...{ id, title, is_private, owner, administrators }} />
      <ParticipantsList {...{ id, participants }} />
      <Chatting {...{ id, alertMsg, muteList }} />
    </>
  );
}
