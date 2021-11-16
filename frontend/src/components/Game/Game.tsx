import Pong from './Pong';

export default function Game(): JSX.Element {
  return (
    <>
      {/* <Pong isLeft={true} /> */}
      <Pong isLeft={false} />
    </>
  );
}
