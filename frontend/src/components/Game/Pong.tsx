import { useMutation, useSubscription } from '@apollo/client';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect, useRef, useState } from 'react';

import useInterval from '../../hooks/useInterval';
import { BallInfo, PaddleInfo } from '../../utils/Apollo/models';
import { CanvasNotifyType } from '../../utils/Apollo/schemaEnums';
import ErrorAlert from '../commons/ErrorAlert';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 75;
const PADDLE_WIDTH = 10;
const PADDLE_DY = 7;

// const START_X = CANVAS_WIDTH / 2;
const START_X = 250;
// const START_Y = CANVAS_HEIGHT / 2;
// const START_Y = CANVAS_HEIGHT - 30;
const START_Y = 470;
// const START_DX = 2;
const START_DX = 0;
// const START_DY = -2;
const START_DY = 0;
// const START_LEFT_PADDLE_Y = Math.floor((CANVAS_HEIGHT - PADDLE_HEIGHT) / 2);
const START_LEFT_PADDLE_Y = 250;
// const START_RIGHT_PADDLE_Y = Math.floor((CANVAS_HEIGHT - PADDLE_HEIGHT) / 2);
const START_RIGHT_PADDLE_Y = 250;

interface PongProps {
  isLeft: boolean;
  gameId: string;
  // initBallInfo: BallInfo;
  // initPaddleInfo: PaddleInfo;
}

export default function Pong({
  isLeft,
  gameId,
}: // initBallInfo,
// initPaddleInfo,
PongProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  // const [upPressed, setUpPressed] = useState<boolean>(false);
  // const [downPressed, setDownPressed] = useState<boolean>(false);
  const [keyDown, setKeyDown] = useState(false);

  const [x, setX] = useState(START_X);
  const [y, setY] = useState(START_Y);
  const [dx, setDx] = useState(START_DX);
  const [dy, setDy] = useState(START_DY);
  const [leftPaddleY, setLeftPaddleY] = useState(START_LEFT_PADDLE_Y);
  const [rightPaddleY, setRightPaddleY] = useState(START_RIGHT_PADDLE_Y);
  const [leftPaddleDy, setLeftPaddleDy] = useState(0);
  const [rightPaddleDy, setRightPaddleDy] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  // const [leftScore, setLeftScore] = useState(0);
  // const [rightScore, setRightScore] = useState(0);

  const myPaddleY = isLeft ? leftPaddleY : rightPaddleY;
  // const myPaddleDy = isLeft ? leftPaddleDy : rightPaddleDy;
  // const setMyPaddleY = isLeft ? setLeftPaddleY : setRightPaddleY;
  // const setMyPaddleDy = isLeft ? setLeftPaddleDy : setRightPaddleDy;
  // const setEnemyPaddle = isLeft ? setRightPaddleY : setLeftPaddleY; // NOTE: 나중에 서버와 통신할떄 쓰일 것...

  const { data, error } = useSubscription<{
    subscribeInGameCanvas: {
      game_id: string;
      type: CanvasNotifyType;
      ball_info?: BallInfo;
      paddle_info?: PaddleInfo;
    };
  }>(
    gql`
      subscription SubscribeInGameCanvas($game_id: ID!) {
        subscribeInGameCanvas(game_id: $game_id) {
          game_id
          type
          ball_info {
            ball_x
            ball_y
            ball_dx
            ball_dy
          }
          paddle_info {
            left_paddle_y
            left_paddle_dy
            right_paddle_y
            right_paddle_dy
          }
        }
      }
    `,
    {
      variables: { game_id: gameId },
    }
  );

  const syncBall = (ballInfo: BallInfo) => {
    const { ball_x, ball_y, ball_dx, ball_dy } = ballInfo;

    setX(ball_x);
    setY(ball_y);
    setDx(ball_dx);
    setDy(ball_dy);
  };

  const syncPaddle = (paddleInfo: PaddleInfo) => {
    const { left_paddle_y, right_paddle_y, left_paddle_dy, right_paddle_dy } =
      paddleInfo;

    console.log(left_paddle_y, right_paddle_y, left_paddle_dy, right_paddle_dy);

    setLeftPaddleY(left_paddle_y);
    setRightPaddleY(right_paddle_y);
    setLeftPaddleDy(left_paddle_dy);
    setRightPaddleDy(right_paddle_dy);
  };

  // useEffect(() => {
  //   syncBall(initBallInfo);
  // }, [initBallInfo]);

  // useEffect(() => {
  //   syncPaddle(initPaddleInfo);
  // }, [initPaddleInfo]);

  // useEffect(()=>{
  //   reset
  // })

  // useEffect(() => {
  //   setIsPlaying(true); // NOTE: 이때만 해주면 될까?
  // }, []);

  useEffect(() => {
    if (!data) return;

    // console.log(data.subscribeInGameCanvas);

    const { type, ball_info, paddle_info } = data.subscribeInGameCanvas;

    switch (type) {
      case CanvasNotifyType.BALL:
        if (!ball_info) return;
        if (isLeft) return;
        syncBall(ball_info);
        break;

      case CanvasNotifyType.PADDLE:
        if (!paddle_info) return;
        syncPaddle(paddle_info);
        break;

      case CanvasNotifyType.START:
        if (!ball_info || !paddle_info) return;
        setIsPlaying(true);
        syncBall(ball_info);
        syncPaddle(paddle_info);
    }
  }, [data]);

  const [movePaddle, { error: movePaddleError }] = useMutation<{
    movePaddle: boolean;
  }>(
    gql`
      mutation MovePaddle(
        $game_id: ID!
        $y: Int!
        $dy: Int!
        $isLeft: Boolean!
      ) {
        movePaddle(game_id: $game_id, y: $y, dy: $dy, isLeft: $isLeft)
        # movePaddle(game_id: $game_id, dy: $dy, isLeft: $isLeft)
      }
    `
  );

  const [ballCollision, { error: ballCollisionError }] = useMutation<{
    ballCollision: boolean;
  }>(
    gql`
      mutation BallCollision(
        $game_id: ID!
        $x: Int!
        $y: Int!
        $dx: Int!
        $dy: Int!
      ) {
        ballCollision(game_id: $game_id, x: $x, y: $y, dx: $dx, dy: $dy)
      }
    `
  );

  const [winRound, { error: winRoundError }] = useMutation<{
    winRound: boolean;
  }>(
    gql`
      mutation WinRound($game_id: ID!, $isLeftWin: Boolean!) {
        winRound(game_id: $game_id, isLeftWin: $isLeftWin)
      }
    `
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.focus();
    const renderCtx = canvasRef.current.getContext('2d');
    if (renderCtx) setCtx(renderCtx);

    drawBall();
    drawLeftPaddle();
    drawRightPaddle();
  }, [ctx]);

  const drawBall = () => {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#7e57c2';
    ctx.fill();
    ctx.closePath();
  };

  const drawLeftPaddle = () => {
    if (!ctx) return;

    ctx.beginPath();
    ctx.rect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#7e57c2';
    ctx.fill();
    ctx.closePath();
  };

  const drawRightPaddle = () => {
    if (!ctx) return;

    ctx.beginPath();
    ctx.rect(
      ctx.canvas.width - PADDLE_WIDTH,
      rightPaddleY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
    ctx.fillStyle = '#7e57c2';
    ctx.fill();
    ctx.closePath();
  };

  // const resetGame = () => {
  //   if (!ctx) return;

  //   // console.log('reset');
  //   // setIsPlaying(false);

  //   setX(START_X);
  //   setY(START_Y);
  //   setDx(START_DX);
  //   setDy(START_DY);
  //   setLeftPaddleY(START_LEFT_PADDLE_Y);
  //   setRightPaddleY(START_RIGHT_PADDLE_Y);
  // };

  const sendBallCollision = async () => {
    if (!isLeft) return; // NOTE 임시!

    // console.log('send', { game_id: gameId, x, y, dx, dy });

    await ballCollision({
      variables: { game_id: gameId, x, y, dx, dy },
    });
  };

  const sendWinRound = async (isLeftWin: boolean) => {
    if (!isLeft) return; // NOTE: left 유저만 정보 전송

    await winRound({
      variables: { game_id: gameId, isLeftWin },
    });
  };

  const draw = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBall();
    drawLeftPaddle();
    drawRightPaddle();

    if (y + dy > ctx.canvas.height - BALL_RADIUS || y + dy < BALL_RADIUS) {
      setDy((prev) => -prev);
    }

    if (x + dx < BALL_RADIUS) {
      // NOTE: 공이 왼쪽으로 갔을 때
      if (y > leftPaddleY && y < leftPaddleY + PADDLE_HEIGHT) {
        setDx((prev) => -prev);
      } else {
        // setRightScore((prev) => prev + 1);
        setIsPlaying(false);
        // resetGame();
        void sendWinRound(!isLeft);
        return;
      }
      void sendBallCollision(); // NOTE: void로 하면 어떻게 될까?
    } else if (x + dx > ctx.canvas.width - BALL_RADIUS) {
      // NOTE: 공이 오른쪽으로 갔을 때
      if (y > rightPaddleY && y < rightPaddleY + PADDLE_HEIGHT) {
        setDx((prev) => -prev);
      } else {
        // setLeftScore((prev) => prev + 1);
        setIsPlaying(false);
        // resetGame();
        void sendWinRound(isLeft);
        return;
      }
      void sendBallCollision();
    }

    // NOTE: 백업... 여차하면 다시 돌려야하니까.
    // // if (upPressed) {
    // setMyPaddleY((prev) => prev + myPaddleDy); // NOTE: canvas는 아래로 갈수록 y가 크다.
    // if (myPaddleY < 0) {
    //   setMyPaddleY(0);
    // }
    // // } else if (downPressed) {
    // // setMyPaddleY((prev) => prev + D_PADDLEY);
    // if (myPaddleY + PADDLE_HEIGHT > ctx.canvas.height) {
    //   setMyPaddleY(ctx.canvas.height - PADDLE_HEIGHT);
    // }
    // // }

    setLeftPaddleY((prev) => prev + leftPaddleDy); // NOTE: canvas는 아래로 갈수록 y가 크다.
    if (leftPaddleY < 0) {
      setLeftPaddleY(0);
    }
    // } else if (downPressed) {
    // setMyPaddleY((prev) => prev + D_PADDLEY);
    if (leftPaddleY + PADDLE_HEIGHT > ctx.canvas.height) {
      setLeftPaddleY(ctx.canvas.height - PADDLE_HEIGHT);
    }
    // }

    setRightPaddleY((prev) => prev + rightPaddleDy); // NOTE: canvas는 아래로 갈수록 y가 크다.
    if (rightPaddleY < 0) {
      setRightPaddleY(0);
    }
    // } else if (downPressed) {
    // setMyPaddleY((prev) => prev + D_PADDLEY);
    if (rightPaddleY + PADDLE_HEIGHT > ctx.canvas.height) {
      setRightPaddleY(ctx.canvas.height - PADDLE_HEIGHT);
    }
    // }

    // console.log(x, y, dx, dy);

    setX((prev) => prev + dx);
    setY((prev) => prev + dy);
  };

  const keyDownHandler = async (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (keyDown) return;
    setKeyDown(true);

    // console.log('keydown!', keyDown);

    if (e.key == 'Up' || e.key == 'ArrowUp') {
      // setUpPressed(true);
      // setMyPaddleDy(-PADDLE_DY);
      await movePaddle({
        variables: { game_id: gameId, y: myPaddleY, dy: -PADDLE_DY, isLeft },
      });
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
      // setDownPressed(true);
      // setMyPaddleDy(PADDLE_DY);
      await movePaddle({
        variables: { game_id: gameId, y: myPaddleY, dy: PADDLE_DY, isLeft },
      });
    }
  };

  const keyUpHandler = async (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!keyDown) return;
    setKeyDown(false);

    // console.log('keyup!', keyDown);

    if (e.key == 'Up' || e.key == 'ArrowUp') {
      // setUpPressed(false);
      // setMyPaddleDy(0);
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
      // setDownPressed(false);
      // setMyPaddleDy(0);
    }
    await movePaddle({
      variables: { game_id: gameId, y: myPaddleY, dy: 0, isLeft },
    });
  };

  useInterval(draw, isPlaying ? 30 : null);
  // useInterval(draw, 30); // NOTE: 대략 30fps?
  // useInterval(draw, 100); // NOTE: 테스트용

  return (
    <>
      {error && <ErrorAlert name="Pong" error={error} />}
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        {/* <Button onClick={() => setIsPlaying((prev) => !prev)}>toggle game</Button> */}
        {/* <Typography>score</Typography>
      <Typography>
        {leftScore} | {rightScore}
      </Typography> */}
        <canvas
          id="canvas"
          ref={canvasRef}
          width={500}
          height={500}
          style={{
            border: '1px solid #000',
            marginTop: 10,
          }}
          tabIndex={0}
          onKeyDown={keyDownHandler}
          onKeyUp={keyUpHandler}
        />
      </Box>
    </>
  );
}
