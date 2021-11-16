import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

import useInterval from '../../hooks/useInterval';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 75;
const PADDLE_WIDTH = 10;

interface PongProps {
  isLeft: boolean;
}

export default function Pong({ isLeft }: PongProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [upPressed, setUpPressed] = useState<boolean>(false);
  const [downPressed, setDownPressed] = useState<boolean>(false);
  const [x, setX] = useState(CANVAS_WIDTH / 2);
  const [y, setY] = useState(CANVAS_HEIGHT - 30);
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(-2);
  const [myPaddleY, setMyPaddleY] = useState((CANVAS_HEIGHT - 75) / 2);
  const [enemyPaddleY, setEnemyPaddleY] = useState((CANVAS_HEIGHT - 75) / 2);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.focus();
    const renderCtx = canvasRef.current.getContext('2d');
    if (renderCtx) setCtx(renderCtx);
  }, [ctx]);

  const drawBall = () => {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#7e57c2';
    ctx.fill();
    ctx.closePath();
  };

  const drawMyPaddle = () => {
    if (!ctx) return;

    ctx.beginPath();
    if (!isLeft) {
      ctx.rect(
        ctx.canvas.width - PADDLE_WIDTH,
        myPaddleY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );
    } else {
      ctx.rect(0, myPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    }
    ctx.fillStyle = '#7e57c2';
    ctx.fill();
    ctx.closePath();
  };

  const drawEnemyPaddle = () => {
    if (!ctx) return;

    ctx.beginPath();
    if (isLeft) {
      ctx.rect(
        ctx.canvas.width - PADDLE_WIDTH,
        enemyPaddleY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );
    } else {
      ctx.rect(0, enemyPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    }
    ctx.fillStyle = '#7e57c2';
    ctx.fill();
    ctx.closePath();
  };

  const draw = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBall();
    drawMyPaddle();
    drawEnemyPaddle();

    if (y + dy > ctx.canvas.height - BALL_RADIUS || y + dy < BALL_RADIUS) {
      setDy((prev) => -prev);
    }
    if (isLeft) {
      if (x + dx < BALL_RADIUS) {
        // NOTE: 공이 왼쪽으로 갔을 때
        if (y > myPaddleY && y < myPaddleY + PADDLE_HEIGHT) {
          setDx((prev) => -prev);
        } else {
          alert('lose');
          document.location.reload();
          setIsPlaying(false);
        }
      } else if (x + dx > ctx.canvas.width - BALL_RADIUS) {
        // NOTE: 공이 오른쪽으로 갔을 때
        if (y > enemyPaddleY && y < enemyPaddleY + PADDLE_HEIGHT) {
          setDx((prev) => -prev);
        } else {
          alert('win');
          document.location.reload();
          setIsPlaying(false);
        }
      }
    } else {
      if (x + dx < BALL_RADIUS) {
        // NOTE: 공이 왼쪽으로 갔을 때
        if (y > enemyPaddleY && y < enemyPaddleY + PADDLE_HEIGHT) {
          setDx((prev) => -prev);
        } else {
          alert('win');
          document.location.reload();
          setIsPlaying(false);
        }
      } else if (x + dx > ctx.canvas.width - BALL_RADIUS) {
        // NOTE: 공이 오른쪽으로 갔을 때
        if (y > myPaddleY && y < myPaddleY + PADDLE_HEIGHT) {
          setDx((prev) => -prev);
        } else {
          alert('lose');
          document.location.reload();
          setIsPlaying(false);
        }
      }
    }

    if (upPressed) {
      setMyPaddleY((prev) => prev - 7); // NOTE: canvas는 아래로 갈수록 y가 크다.
      if (myPaddleY < 0) {
        setMyPaddleY(0);
      }
    } else if (downPressed) {
      setMyPaddleY((prev) => prev + 7);
      if (myPaddleY + PADDLE_HEIGHT > ctx.canvas.height) {
        setMyPaddleY(ctx.canvas.height - PADDLE_HEIGHT);
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
