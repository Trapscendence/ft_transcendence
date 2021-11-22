import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';

import { userIdVar } from '../..';
import { GameType } from '../../utils/Apollo/schemaEnums';
import ErrorAlert from '../commons/ErrorAlert';
import LoadingBackdrop from '../commons/LoadingBackdrop';
import GameContents from './GameContents';

export default function Game(): JSX.Element {
  const location = useLocation<{ game_id: string }>();

  if (!location.state) return <Redirect to="/home" />;

  const { game_id } = location.state;

  const { data, error, loading, refetch } = useQuery<{
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
      query GetGame($game_id: ID!) {
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
    { variables: { game_id } }
  );

  // NOTE: 아래처럼 user의 game 정보 받아오는 방식으로 하려했으나... game을 못 얻어오는 경우가 발생한다.
  // 만약 그런식으로 하려면 channel과 channelList처럼 한군데에서 정보를 받고, refetch해서 보내주는 식으로 해야할 듯?

  // const {
  //   data: gameData,
  //   loading,
  //   error,
  //   refetch,
  // } = useQuery<{
  //   user: {
  //     // id: string;
  //     game: {
  //       id: string;
  //       game_type: GameType;
  //       left_score: number;
  //       right_score: number;
  //       left_player: {
  //         id: string;
  //         nickname: string;
  //       };
  //       right_player: {
  //         id: string;
  //         nickname: string;
  //       };
  //       observers: {
  //         id: string;
  //         nickname: string;
  //       }[];
  //     };
  //   };
  // }>(
  //   gql`
  //     query GetGameByUserId($id: ID!) {
  //       user(id: $id) {
  //         # id
  //         game {
  //           id
  //           game_type
  //           left_score
  //           right_score
  //           left_player {
  //             id
  //             nickname
  //             # NOTE: avatar가 아직 구현이 안되어있는 것 같아서...
  //           }
  //           right_player {
  //             id
  //             nickname
  //           }
  //           observers {
  //             id
  //             nickname
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   {
  //     variables: { id: userIdVar() },
  //     // onCompleted: (d) => {
  //     //   console.log('dddddddd....', d);
  //     // },
  //   }
  // ); // TODO: 추후 확실해지면 분리

  if (loading) return <LoadingBackdrop loading={loading} />; // NOTE: loading일 때에는 data가 undefined이므로, 이런 경우(data에 따라 결과 분기하는 경우) loading 처리를 꼭 해줘야!
  if (error) return <ErrorAlert name="Game" error={error} />;
  if (!data) return <></>;

  return <GameContents gameData={data.game} refetchGameData={refetch} />;
}

// NOTE: 나중에는 라운드 별로 호스트가 달라지도록... 지금은 그냥 왼쪽 유저가 호스트
