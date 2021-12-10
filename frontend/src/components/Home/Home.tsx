// import { Redirect } from 'react-router';

import { useLocation } from 'react-router';

import GameEndModal from '../Game/GameEndModal';

function Home(): JSX.Element {
  const location = useLocation<{ winner: { nickname: string } }>();

  if (!location.state) return <div>Home</div>;

  const { winner } = location.state;

  return (
    <>
      {winner && <GameEndModal open={!!winner} winner={winner.nickname} />}
      <div>Home</div>
    </>
  );
}

export default Home;
