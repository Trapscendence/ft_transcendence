import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Redirect } from 'react-router';

import { userIdVar } from '../..';
import { GameType } from '../../utils/Apollo/schemaEnums';
import LoadingBackdrop from '../commons/LoadingBackdrop';
import GameContents from './GameContents';

export default function Game(): JSX.Element {
  const {
    data: gameData,
    loading,
    refetch,
  } = useQuery<{
    user: {
      id: string;
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
  }>(
    gql`
      query GetGameByUserId($id: ID!) {
        user(id: $id) {
          id
          game {
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
      }
    `,
    {
      variables: { id: userIdVar() },
    }
  ); // TODO: 추후 확실해지면 분리

  if (loading) return <LoadingBackdrop loading={loading} />; // NOTE: loading일 때에는 data가 undefined이므로, 이런 경우(data에 따라 결과 분기하는 경우) loading 처리를 꼭 해줘야!

  if (!gameData || !gameData.user.game) return <Redirect to="/home" />; // NOTE: game 중이 아니면 home으로 리다이렉트

  return (
    <GameContents gameData={gameData.user.game} refetchGameData={refetch} />
  );
}

// NOTE: 나중에는 라운드 별로 호스트가 달라지도록... 지금은 그냥 왼쪽 유저가 호스트
