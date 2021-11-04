import ChannelHeader from './ChannelHeader';
import Chatting from './Chatting';
import ParticipantsList from './ParticipantsList';

export default function Channel(): JSX.Element {
  // TODO: 여기서 subscription을 관리하면 되지 않을까?

  return (
    <>
      <ChannelHeader />
      <ParticipantsList />
      <Chatting />
    </>
  );
}
