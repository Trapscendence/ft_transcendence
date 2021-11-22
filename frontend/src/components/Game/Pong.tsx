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

// NOTE: 백엔드 시작값과 동일하게 맞춰야 위화감이 없다. (시작 딜레이 후 캔버스 초기값을 전달받으므로)
// 처음 렌더링을 주석처리하면, 위의 값들이 직접 렌더링되는 경우는 없음. 근데 맨 처음에 렌더링 되어있는게 보기 좋은 듯...
// 따라서 상수화해서 백엔드, 프론트엔드 값을 동일하게 맞추는 것이 제일 나을 듯

interface PongProps {
  isLeft: boolean;
  gameId: string;
  isObserve: boolean;
  // initBallInfo: BallInfo;
  // initPaddleInfo: PaddleInfo;
}

export default function Pong({
  isLeft,
  gameId,
  isObserve,
}: // initBallInfo,
// initPaddleInfo,
PongProps): JSX.Element {
  /*
   ** ANCHOR: states
   */

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [x, setX] = useState(START_X);
  const [y, setY] = useState(START_Y);
  const [dx, setDx] = useState(START_DX);
  const [dy, setDy] = useState(START_DY);
  const [leftPaddleY, setLeftPaddleY] = useState(START_LEFT_PADDLE_Y);
  const [rightPaddleY, setRightPaddleY] = useState(START_RIGHT_PADDLE_Y);
  const [leftPaddleDy, setLeftPaddleDy] = useState(0);
  const [rightPaddleDy, setRightPaddleDy] = useState(0);

  const [keyDown, setKeyDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const myPaddleY = isLeft ? leftPaddleY : rightPaddleY;

  /*
   ** ANCHOR: Apollo
   */

  const { data, error } = useSubscription<{
    subscribeCanvas: {
      game_id: string;
      type: CanvasNotifyType;
      ball_info?: BallInfo;
      paddle_info?: PaddleInfo;
    };
  }>(
    gql`
      subscription SubscribeCanvas($game_id: ID!) {
        subscribeCanvas(game_id: $game_id) {
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

  /*
   ** ANCHOR: useEffect
   */

  useEffect(() => {
    setIsPlaying(true);
  }, []);

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

    setLeftPaddleY(left_paddle_y);
    setRightPaddleY(right_paddle_y);
    setLeftPaddleDy(left_paddle_dy);
    setRightPaddleDy(right_paddle_dy);
  };

  useEffect(() => {
    if (!data) return;

    // console.log(data.subscribeInGameCanvas);

    const { type, ball_info, paddle_info } = data.subscribeCanvas;

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

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.focus();
    const renderCtx = canvasRef.current.getContext('2d');
    if (renderCtx) setCtx(renderCtx);

    drawBall();
    drawLeftPaddle();
    drawRightPaddle();
  }, [ctx]);

  /*
   ** ANCHOR: Draw Functions
   */

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

  const sendBallCollision = async () => {
    if (!isLeft) return; // NOTE: left 유저만 정보 전송... 추후 라운드마다 호스트 번갈아 바꾸는 식으로 개선

    await ballCollision({
      variables: { game_id: gameId, x, y, dx, dy },
    });
  }; // NOTE: try-catch 추가해야 할 수도...

  const sendWinRound = async (isLeftWin: boolean) => {
    if (!isLeft) return;

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
        setIsPlaying(false);
        void sendWinRound(!isLeft);
        return;
      }
      void sendBallCollision();
    } else if (x + dx > ctx.canvas.width - BALL_RADIUS) {
      // NOTE: 공이 오른쪽으로 갔을 때
      if (y > rightPaddleY && y < rightPaddleY + PADDLE_HEIGHT) {
        setDx((prev) => -prev);
      } else {
        setIsPlaying(false);
        void sendWinRound(isLeft);
        return;
      }
      void sendBallCollision();
    }

    setLeftPaddleY((prev) => prev + leftPaddleDy); // NOTE: canvas는 아래로 갈수록 y가 크다.
    if (leftPaddleY < 0) {
      setLeftPaddleY(0);
    }
    if (leftPaddleY + PADDLE_HEIGHT > ctx.canvas.height) {
      setLeftPaddleY(ctx.canvas.height - PADDLE_HEIGHT);
    }

    setRightPaddleY((prev) => prev + rightPaddleDy);
    if (rightPaddleY < 0) {
      setRightPaddleY(0);
    }
    if (rightPaddleY + PADDLE_HEIGHT > ctx.canvas.height) {
      setRightPaddleY(ctx.canvas.height - PADDLE_HEIGHT);
    }

    setX((prev) => prev + dx);
    setY((prev) => prev + dy);
  };

  const keyDownHandler = async (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (isObserve) return;
    if (keyDown) return;
    setKeyDown(true);

    if (e.key == 'Up' || e.key == 'ArrowUp') {
      await movePaddle({
        variables: { game_id: gameId, y: myPaddleY, dy: -PADDLE_DY, isLeft },
      });
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
      await movePaddle({
        variables: { game_id: gameId, y: myPaddleY, dy: PADDLE_DY, isLeft },
      });
    }
  };

  const keyUpHandler = async (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (isObserve) return;
    if (!keyDown) return;
    setKeyDown(false);

    if (
      e.key == 'Up' ||
      e.key == 'ArrowUp' ||
      e.key == 'Down' ||
      e.key == 'ArrowDown'
    ) {
      await movePaddle({
        variables: { game_id: gameId, y: myPaddleY, dy: 0, isLeft },
      });
    } // NOTE: 사실 e.key에 대한 검사 없이도 잘 작동... 예외를 잘 모르겠다.
  };

  useInterval(draw, isPlaying ? 30 : null); // NOTE: 대략 30fps
  // useInterval(draw, 30);

  const errorVar =
    error || movePaddleError || ballCollisionError || winRoundError;

  return (
    <>
      {errorVar && <ErrorAlert name="Pong" error={errorVar} />}
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
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
