import { useMutation, useSubscription } from '@apollo/client';
import { VideogameAsset } from '@mui/icons-material';
import { CircularProgress, Tab } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import useSnackbar from '../../hooks/useSnackbar';
import { SUBSCRIBE_MATCH } from '../../utils/Apollo/gqls';
import { SubscribeMatchResponse } from '../../utils/Apollo/responseModels';
import { GameNotifyType } from '../../utils/Apollo/schemaEnums';
import handleError from '../../utils/handleError';
import ErrorAlert from '../commons/ErrorAlert';
import MsgSnackbar from '../commons/MsgSnackbar';
import MatchedModal from './MatchedModal';

export default function Matching(): JSX.Element {
  const [registered, setRegistered] = useState(false);
  const [matched, setMatched] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();

  const { data: matchData, error } =
    useSubscription<SubscribeMatchResponse>(SUBSCRIBE_MATCH);

  const [registerMatch, { error: registerError }] = useMutation<{
    registerMatch: boolean;
  }>(gql`
    mutation RegisterMatch {
      registerMatch
    }
  `);

  const [cancelRegister, { error: cancelError }] = useMutation<{
    cancelRegister: boolean;
  }>(gql`
    mutation CancelRegister {
      cancelRegister
    }
  `);

  const [alertMsg, displayAlertMsg] = useSnackbar(3000);

  useEffect(() => {
    if (!matchData) return;

    setBtnLoading(false);

    console.log(matchData.subscribeMatch);

    const { type, game_id } = matchData.subscribeMatch;

    switch (type) {
      case GameNotifyType.MATCHED:
        setRegistered(false);
        setMatched(true);
        break;
      case GameNotifyType.JOIN:
        setMatched(false);
        history.push('/game', { game_id });
        break;
      case GameNotifyType.BOOM:
        setMatched(false);
        displayAlertMsg(`Match is canceled.`);
        break;
    }
  }, [matchData]);

  const onClickPlay = async () => {
    if (registered) {
      setRegistered(false);
      await handleError(cancelRegister);
    } else {
      setRegistered(true);
      await handleError(registerMatch);
    }
  };

  const handleCloseMatchedModal = () => {
    setMatched(false);
  };

  const errorVar = error || registerError || cancelError;

  return (
    <>
      {errorVar && <ErrorAlert name="Matching" error={errorVar} />}
      {matchData && (
        <MatchedModal
          open={matched}
          handleClose={handleCloseMatchedModal}
          id={matchData.subscribeMatch.game_id}
          btnLoading={btnLoading}
          setBtnLoading={setBtnLoading}
        />
      )}
      {alertMsg && <MsgSnackbar msg={alertMsg} severity="info" />}
      <Box
        onClick={onClickPlay}
        sx={{ position: 'relative', cursor: 'pointer' }}
      >
        <Tab
          icon={<VideogameAsset />}
          // disabled={loading}
          sx={{ color: registered ? 'text.disabled' : '' }}
          // onClick={() => history.push('/game')}
        />
        {registered && (
          <CircularProgress
            size={35}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-17px',
              marginLeft: '-17px',
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </>
  );
}
