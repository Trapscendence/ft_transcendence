import { useQuery, useSubscription } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { Card } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';

import { userIdVar } from '../..';
import { BallInfo, PaddleInfo } from '../../utils/Apollo/models';
import { GameType } from '../../utils/Apollo/schemaEnums';
import ErrorAlert from '../commons/ErrorAlert';
import UserSummary from '../commons/UserSummary';
import Pong from './Pong';

interface locationState {
  game_id: string;
}

enum InGameNotifyType {
  // BALL = 'BALL',
  // PADDLE = 'PADDLE',
  OBSERVER = 'OBSERVER',
  WINLOSE = 'WINLOSE',
  END = 'END',
}

export default function Game(): JSX.Element {
  const location = useLocation<locationState>();

  if (!location.state) return <Redirect to="/home" />;

  const { game_id } = location.state;

  const { data: gameData, refetch } = useQuery<{
    game: {
      id: string;
      game_type: GameType;
      // ball_info: BallInfo;
      // paddle_info: PaddleInfo;
      left_score: number;
      right_score: number;
      left_player: {
        id: string;
        nickname: string;
      };
      right_player: {
        id: string;
        nickname: string;
      };
      observers: {
        id: string;
        nickname: string;
      }[];
    };
  }>(
    gql`
      query Game($game_id: ID!) {
        game(game_id: $game_id) {
          id
          game_type
          # ball_info {
          #   ball_x
          #   ball_y
          #   ball_dx
          #   ball_dy
          # }
          # paddle_info {
          #   left_paddle_y
          #   left_paddle_dy
          #   right_paddle_y
          #   right_paddle_dy
          # }
          left_score
          right_score
          left_player {
            id
            nickname
            # NOTE: avatar가 아직 구현이 안되어있는 것 같아서...
          }
          right_player {
            id
            nickname
          }
          observers {
            id
            nickname
          }
        }
      }
    `,
    {
      variables: { game_id },
    }
  );

  const { data, error } = useSubscription<{
    subscribeInGame: {
      type: InGameNotifyType;
      game_id: string;
    };
  }>(
    gql`
      subscription SubscribeInGame($game_id: ID!) {
        subscribeInGame(game_id: $game_id) {
          type
          game_id
        }
      }
    `,
    {
      variables: { game_id },
    }
  );

  // const [moveLeftPaddle] = useMutation<{ movePaddle: boolean }>(gql`
  //   mutation MovePaddle($game_id: ID!, $dy: Int!, $isLeft: Boolean!) {
  //     movePaddle(game_id: $game_id, dy: $dy, isLeft: $isLeft)
  //   }
  // `);

  useEffect(() => {
    if (!data) return;

    console.log(data.subscribeInGame);

    void refetch();
  }, [data]);

  if (!gameData) return <></>;

  const {
    // ball_info,
    // paddle_info,
    left_score,
    right_score,
    left_player,
    right_player,
  } = gameData.game;
  const isLeft = left_player.id === userIdVar();

  // const round = left_score + right_score + 1;

  return (
    <>
      {error && <ErrorAlert name="Game" error={error} />}
      <Box display="flex" justifyContent="space-between">
        <Card sx={{ display: 'flex' }}>
          <UserSummary IUser={left_player} />
          <Typography>score: {left_score}</Typography>
        </Card>
        <Card>
          <UserSummary IUser={right_player} />
          <Typography>score: {right_score}</Typography>
        </Card>
      </Box>
      <Pong
        isLeft={isLeft}
        gameId={game_id}
        // initBallInfo={ball_info}
        // initPaddleInfo={paddle_info}
      />
    </>
  );
}

// NOTE: 나중에는 라운드 별로 호스트가 달라지도록... 지금은 그냥 왼쪽 유저가 호스트
