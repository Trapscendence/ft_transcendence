import SocialDrawerItem from './SocialDrawerItem';

interface SocialDrawerItemContainerProps {
  avatar?: string;
  nickname: string;
  statusMessage?: string;
}

function SocialDrawerItemContainer({
  avatar,
  nickname,
  statusMessage,
}: SocialDrawerItemContainerProps): JSX.Element {
  return <SocialDrawerItem {...{ avatar, nickname, statusMessage }} />;
}

export default SocialDrawerItemContainer;
