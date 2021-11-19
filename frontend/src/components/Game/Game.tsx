import { useHistory, useLocation } from 'react-router';

import Pong from './Pong';

interface locationState {
  game_id: string;
}

export default function Game(): JSX.Element {
  const location = useLocation<locationState>();
  const { game_id } = location.state;

  if (!game_id) return <></>;

  return (
    <>
      {/* <Pong isLeft={true} /> */}
      <Pong isLeft={false} />
    </>
  );
}
