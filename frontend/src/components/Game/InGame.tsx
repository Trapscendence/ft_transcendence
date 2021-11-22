import {
  ApolloQueryResult,
  OperationVariables,
  useSubscription,
} from '@apollo/client';
import { Typography } from '@material-ui/core';
import { Card } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';

import { userIdVar } from '../..';
import { GameNotifyType, GameType } from '../../utils/Apollo/schemaEnums';
import { User } from '../../utils/Apollo/User';
import ErrorAlert from '../commons/ErrorAlert';
import GameEndModal from './GameEndModal';
import Pong from './Pong';

interface InGameProps {
  gameData: {
    user: {
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
    };
  };
  refetchGameData: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<
    ApolloQueryResult<{
      user: {
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
      };
    }>
  >;
}

export default function InGame({
  gameData,
  refetchGameData,
}: InGameProps): JSX.Element {
  const { id, left_score, right_score, left_player, right_player } =
    gameData.user.game;
  const isLeft = left_player.id === userIdVar();
  const round = left_score + right_score + 1;

  const [gameWinner, setGameWinner] = useState<string | null>(null);

  const { data, error } = useSubscription<{
    subscribeGame: {
      type: GameNotifyType;
      game_id: string;
      winner?: User;
    };
  }>(
    gql`
      subscription SubscribeGame($game_id: ID!) {
        subscribeGame(game_id: $game_id) {
          type
          game_id
          winner {
            nickname
          }
        }
      }
    `,
    {
      variables: { game_id: id },
    }
  );

  useEffect(() => {
    if (!data) return;

    // console.log(data.subscribeInGame);

    void refetchGameData();

    const { type, winner } = data.subscribeGame;

    switch (type) {
      case GameNotifyType.END:
        if (!winner) return;
        setGameWinner(winner.nickname);
        break;
    }
  }, [data]);

  return (
    <>
      {error && <ErrorAlert name="Game" error={error} />}
      <Card sx={{ m: 1, p: 1, bgcolor: 'secondary.light' }}>
        <Typography>round: {round}</Typography>
      </Card>
      <Box display="flex" justifyContent="space-between">
        <Card variant="outlined" sx={{ m: 1, p: 1 }}>
          <Typography>{left_player.nickname}</Typography>
          <Typography>score: {left_score}</Typography>
        </Card>
        <Card variant="outlined" sx={{ m: 1, p: 1 }}>
          <Typography>{right_player.nickname}</Typography>
          <Typography>score: {right_score}</Typography>
        </Card>
      </Box>
      <Pong isLeft={isLeft} gameId={id} />
      {gameWinner && <GameEndModal open={!!gameWinner} winner={gameWinner} />}
    </>
  );
}
