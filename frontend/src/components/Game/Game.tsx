import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { Redirect } from 'react-router';

import { userIdVar } from '../..';
import { GameType } from '../../utils/Apollo/schemaEnums';
import InGame from './InGame';

export default function Game(): JSX.Element {
  const { data: gameData, refetch } = useQuery<{
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
  }>(
    gql`
      query GetGameByUserId($id: ID!) {
        user(id: $id) {
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
      // onCompleted: (d) => {
      //   console.log('re??', d);
      // },
    }
  );

  useEffect(() => {
    void refetch();
  });

  if (!gameData) {
    return <></>;
  }

  // if (!gameData.user.game) return <Redirect to="/home" />;
  if (!gameData.user.game) return <></>;

  return <InGame gameData={gameData.user.game} refetchGameData={refetch} />;
}

// NOTE: 나중에는 라운드 별로 호스트가 달라지도록... 지금은 그냥 왼쪽 유저가 호스트
