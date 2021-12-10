import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useSubscription,
} from '@apollo/client';
import { CardContent } from '@material-ui/core';
import { Button, Card, CardActions, Typography } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

import { userIdVar } from '../..';
import { GameNotifyType, GameType } from '../../utils/Apollo/schemaEnums';
import { User } from '../../utils/Apollo/User';
import ErrorAlert from '../commons/ErrorAlert';
import Pong from './Pong';

interface GameContentsProps {
  gameData: {
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
    paddle_height: number;
  };
  refetchGameData: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<
    ApolloQueryResult<{
      // id: string;
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
        paddle_height: number;
      };
    }>
  >;
  isObserve: boolean;
}

export default function GameContents({
  gameData,
  refetchGameData,
  isObserve,
}: GameContentsProps): JSX.Element {
  const {
    id,
    left_score,
    right_score,
    left_player,
    right_player,
    paddle_height,
  } = gameData;
  const isLeft = left_player.id === userIdVar();
  const round = left_score + right_score + 1;

  const history = useHistory();

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

  const [surrenderGame] = useMutation<{
    surrenderGame: boolean;
  }>(
    gql`
      mutation SurrenderGame($game_id: ID!, $isLeft: Boolean!) {
        surrenderGame(game_id: $game_id, isLeft: $isLeft)
      }
    `,
    {
      variables: { game_id: id, isLeft },
    }
  );

  useEffect(() => {
    if (!data) return;

    // console.log(data.subscribeGame);

    const { type, winner } = data.subscribeGame;

    switch (type) {
      case GameNotifyType.WINLOSE:
        void refetchGameData();
        break;
      case GameNotifyType.END:
        if (!winner) return;
        history.push('/home', { winner });
        break;
    }
  }, [data]);

  const onClickSurrender = async () => {
    await surrenderGame();
  };

  return (
    <>
      {error && <ErrorAlert name="Game" error={error} />}
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: 1,
          p: 1,
          bgcolor: 'secondary.light',
        }}
      >
        <CardContent>
          <Typography>{isObserve ? 'Observe mode' : 'Play mode'}</Typography>
          <Typography>round: {round}</Typography>
        </CardContent>
        <CardActions>
          {isObserve ? (
            <Button
              variant="contained"
              onClick={() => {
                history.push('/home');
              }}
            >
              leave game
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ bgcolor: 'secondary' }}
              onClick={onClickSurrender}
            >
              surrender
            </Button>
          )}
        </CardActions>
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
      <Pong
        isLeft={isLeft}
        gameId={id}
        isObserve={isObserve}
        paddleHeight={paddle_height}
      />
    </>
  );
}

// NOTE: InGame 컴포넌트를 공통으로 쓰고, 상위에서 관전인지 플레이어인지 결정하는?
