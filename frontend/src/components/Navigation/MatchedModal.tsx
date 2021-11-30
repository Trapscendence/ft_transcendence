import { useMutation } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import { Button, Card, CardActions, CardContent, Modal } from '@mui/material';
import gql from 'graphql-tag';

import ErrorAlert from '../commons/ErrorAlert';

interface MatchedModalProps {
  open: boolean;
  id: string;
  btnLoading: boolean;
  setBtnLoading: (bool: boolean) => void;
  customNick: string | null;
}

export default function MatchedModal({
  open,
  id,
  btnLoading,
  setBtnLoading,
  customNick,
}: MatchedModalProps): JSX.Element {
  const [joinGame, { error: joinError }] = useMutation<{ joinGame: boolean }>(
    gql`
      mutation JoinGame($game_id: ID!) {
        joinGame(game_id: $game_id)
      }
    `,
    {
      variables: {
        game_id: id,
      },
    }
  );

  const [notJoinGame, { error: notJoinError }] = useMutation<{
    notJoinGame: boolean;
  }>(
    gql`
      mutation NotJoinGame($game_id: ID!) {
        notJoinGame(game_id: $game_id)
      }
    `,
    {
      variables: {
        game_id: id,
      },
    }
  );

  const onClickYes = async () => {
    setBtnLoading(true);
    await joinGame();
  };

  const onClickNo = async () => {
    await notJoinGame();
  };

  const errorVar = joinError || notJoinError;

  return (
    <>
      {errorVar && <ErrorAlert name="MatchedModal" error={errorVar} />}
      <Modal
        open={open}
        // onClose={handleClose} // NOTE: 외부 클릭해도 모달 꺼지지 않게 하려면 onClose 옵션을 안줘야
      >
        <Card
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CardContent>
            <Typography>
              {customNick
                ? `Custom game is asked from ${customNick}! Would you like to join the game?`
                : 'Rank game is matched! Would you like to join the game?'}
            </Typography>
          </CardContent>
          <CardActions>
            <LoadingButton
              variant="contained"
              loading={btnLoading}
              disabled={btnLoading}
              onClick={onClickYes}
            >
              yes
            </LoadingButton>
            <Button
              variant="contained"
              disabled={btnLoading}
              onClick={onClickNo}
            >
              no
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
