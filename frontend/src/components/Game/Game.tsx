import { useQuery, useSubscription } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { Card } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router';

import { userIdVar } from '../..';
import { GameNotifyType, GameType } from '../../utils/Apollo/schemaEnums';
import ErrorAlert from '../commons/ErrorAlert';
import UserSummary from '../commons/UserSummary';
import GameEndModal from './GameEndModal';
import Pong from './Pong';

interface locationState {
  game_id: string;
}

export default function Game(): JSX.Element {
  const location = useLocation<locationState>();

  if (!location.state) return <Redirect to="/home" />;

  const { game_id } = location.state;

  const [isGameEnd, setIdGameEnd] = useState(false);

  const { data: gameData, refetch } = useQuery<{
    game: {
      id: string;
      game_type: GameType;
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
    subscribeGame: {
      type: GameNotifyType;
      game_id: string;
    };
  }>(
    gql`
      subscription SubscribeGame($game_id: ID!) {
        subscribeGame(game_id: $game_id) {
          type
          game_id
        }
      }
    `,
    {
      variables: { game_id },
    }
  );

  useEffect(() => {
    if (!data) return;

    // console.log(data.subscribeInGame);

    void refetch();

    const { type } = data.subscribeGame;

    switch (type) {
      case GameNotifyType.END:
        setIdGameEnd(true);
        break;
    }
  }, [data]);

  if (!gameData) return <></>;

  const { left_score, right_score, left_player, right_player } = gameData.game;
  const isLeft = left_player.id === userIdVar();
  const round = left_score + right_score + 1;
  // const isGameEnd = left_score > 3 || right_score > 3;

  return (
    <>
      {error && <ErrorAlert name="Game" error={error} />}
      {isGameEnd && <GameEndModal open={isGameEnd} />}
      <Card sx={{ m: 1, p: 1, bgcolor: 'secondary.light' }}>
        <Typography>round: {round}</Typography>
      </Card>
      <Box display="flex" justifyContent="space-between">
        {/* <Card sx={{ display: 'flex' }}> */}
        <Card variant="outlined" sx={{ m: 1, p: 1 }}>
          {/* <UserSummary IUser={left_player} /> */}
          <Typography>{left_player.nickname}</Typography>
          <Typography>score: {left_score}</Typography>
        </Card>
        <Card variant="outlined" sx={{ m: 1, p: 1 }}>
          {/* <UserSummary IUser={right_player} /> */}
          <Typography>{right_player.nickname}</Typography>
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
