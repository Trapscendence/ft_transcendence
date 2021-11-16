import { useEffect, useRef, useState } from 'react';

import useInterval from '../../../hooks/useInterval';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;

export default function Pong(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [rightPressed, setRightPressed] = useState<boolean>(false);
  const [leftPressed, setLeftPressed] = useState<boolean>(false);
  const [x, setX] = useState(CANVAS_WIDTH / 2);
  const [y, setY] = useState(CANVAS_HEIGHT - 30);
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(-2);
  const [paddleX, setPaddleX] = useState((CANVAS_WIDTH - 75) / 2);

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        setCtx(renderCtx);
      }
    }
  }, [ctx]);

  const drawBall = () => {
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }
  };

  const drawPaddle = () => {
    if (ctx) {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        ctx.canvas.height - PADDLE_HEIGHT,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }
  };

  const draw = () => {
    if (ctx) {
      // console.log(x, y, dx, dy);
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBall();
      drawPaddle();

      if (x + dx > ctx.canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) {
        // setDx(-dx);
        setDx((prev) => -prev);
      }
      if (y + dy > ctx.canvas.height - BALL_RADIUS || y + dy < BALL_RADIUS) {
        // setDy(-dy);
        setDy((prev) => -prev);
      }

      if (rightPressed) {
        setPaddleX((prev) => prev + 7);
        if (paddleX + PADDLE_WIDTH > ctx.canvas.width) {
          setPaddleX(ctx.canvas.width - PADDLE_WIDTH);
        }
      } else if (leftPressed) {
        setPaddleX((prev) => prev - 7);
        if (paddleX < 0) {
          setPaddleX(0);
        }
      }

      setX((prev) => {
        // console.log(prev + dx);
        return prev + dx;
      });
      setY((prev) => {
        // console.log(prev + dy);
        return prev + dy;
      });
    }
  };

  function keyDownHandler(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      setRightPressed(true);
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      setLeftPressed(true);
    }
  }

  function keyUpHandler(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      setRightPressed(false);
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      setLeftPressed(false);
    }
  }

  useInterval(draw, 10);

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          border: '2px solid #000',
          marginTop: 10,
        }}
        tabIndex={0}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
      />
    </div>
  );
}
