import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

import useInterval from '../../hooks/useInterval';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 75;
const PADDLE_WIDTH = 10;

const START_X = CANVAS_WIDTH / 2;
// const START_Y = CANVAS_HEIGHT / 2;
const START_Y = CANVAS_HEIGHT - 30;
const START_DX = 2;
const START_DY = -2;
const START_LEFT_PADDLE_Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
const START_RIGHT_PADDLE_Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;

interface PongProps {
  isLeft: boolean;
}

export default function Pong({ isLeft }: PongProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [upPressed, setUpPressed] = useState<boolean>(false);
  const [downPressed, setDownPressed] = useState<boolean>(false);
  const [x, setX] = useState(START_X);
  const [y, setY] = useState(START_Y);
  const [dx, setDx] = useState(START_DX);
  const [dy, setDy] = useState(START_DY);
  const [leftPaddleY, setLeftPaddleY] = useState(START_LEFT_PADDLE_Y);
  const [rightPaddleY, setRightPaddleY] = useState(START_RIGHT_PADDLE_Y);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const myPaddle = isLeft ? leftPaddleY : rightPaddleY;
  const setMyPaddle = isLeft ? setLeftPaddleY : setRightPaddleY;
  // const setEnemyPaddle = isLeft ? setRightPaddleY : setLeftPaddleY; // NOTE: 나중에 서버와 통신할떄 쓰일 것...

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

  const resetGame = () => {
    if (!ctx) return;

    // console.log('reset');
    // setIsPlaying(false);

    setX(START_X);
    setY(START_Y);
    setDx(START_DX);
    setDy(START_DY);
    setLeftPaddleY(START_LEFT_PADDLE_Y);
    setRightPaddleY(START_RIGHT_PADDLE_Y);
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
        setRightScore((prev) => prev + 1);
        resetGame();
      }
    } else if (x + dx > ctx.canvas.width - BALL_RADIUS) {
      // NOTE: 공이 오른쪽으로 갔을 때
      if (y > rightPaddleY && y < rightPaddleY + PADDLE_HEIGHT) {
        setDx((prev) => -prev);
      } else {
        setLeftScore((prev) => prev + 1);
        resetGame();
      }
    }

    if (upPressed) {
      setMyPaddle((prev) => prev - 7); // NOTE: canvas는 아래로 갈수록 y가 크다.
      if (myPaddle < 0) {
        setMyPaddle(0);
      }
    } else if (downPressed) {
      setMyPaddle((prev) => prev + 7);
      if (myPaddle + PADDLE_HEIGHT > ctx.canvas.height) {
        setMyPaddle(ctx.canvas.height - PADDLE_HEIGHT);
      }
    }

    setX((prev) => prev + dx);
    setY((prev) => prev + dy);
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key == 'Up' || e.key == 'ArrowUp') {
      setUpPressed(true);
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
      setDownPressed(true);
    }
  };

  const keyUpHandler = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key == 'Up' || e.key == 'ArrowUp') {
      setUpPressed(false);
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
      setDownPressed(false);
    }
  };

  useInterval(draw, isPlaying ? 10 : null);

  return (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <Button onClick={() => setIsPlaying((prev) => !prev)}>toggle game</Button>
      <Typography>score</Typography>
      <Typography>
        {leftScore} | {rightScore}
      </Typography>
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
  );
}
