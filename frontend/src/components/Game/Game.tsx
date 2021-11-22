import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Redirect, useLocation } from 'react-router';

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

  if (loading) return <LoadingBackdrop loading={loading} />; // NOTE: loading일 때에는 data가 undefined이므로, 이런 경우(data에 따라 결과 분기하는 경우) loading 처리를 꼭 해줘야!
  if (error) return <ErrorAlert name="Game" error={error} />;
  if (!data) return <></>;

  return <GameContents gameData={data.game} refetchGameData={refetch} />;
}

// NOTE: 나중에는 라운드 별로 호스트가 달라지도록... 지금은 그냥 왼쪽 유저가 호스트
