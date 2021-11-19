import { Redirect, useLocation } from 'react-router';

import Pong from './Pong';

interface locationState {
  game_id: string;
}

export default function Game(): JSX.Element {
  const location = useLocation<locationState>();

  if (!location.state) return <Redirect to="/home" />;

  const { game_id } = location.state;

  return (
    <>
      {/* <Pong isLeft={true} /> */}
      <Pong isLeft={false} />
    </>
  );
}
