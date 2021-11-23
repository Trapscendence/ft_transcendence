import { useMutation, useSubscription } from '@apollo/client';
import { VideogameAsset } from '@mui/icons-material';
import { CircularProgress, Tab } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import useSnackbar from '../../hooks/useSnackbar';
import { SUBSCRIBE_REGISTER } from '../../utils/Apollo/gqls';
import { SubscribeRegisterResponse } from '../../utils/Apollo/responseModels';
import { RegisterNotifyType } from '../../utils/Apollo/schemaEnums';
import handleError from '../../utils/handleError';
import ErrorAlert from '../commons/ErrorAlert';
import MsgSnackbar from '../commons/MsgSnackbar';
import MatchedModal from './MatchedModal';

export default function Matching(): JSX.Element {
  const [registered, setRegistered] = useState(false);
  const [matched, setMatched] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [customNick, setCustomNick] = useState<string | null>(null);
  const history = useHistory();

  const { data: registerData, error } =
    useSubscription<SubscribeRegisterResponse>(SUBSCRIBE_REGISTER);

  const [registerGame, { error: registerError }] = useMutation<{
    registerGame: boolean;
  }>(gql`
    mutation RegisterGame {
      registerGame
    }
  `);

  const [unregisterGame, { error: cancelError }] = useMutation<{
    unregisterGame: boolean;
  }>(gql`
    mutation UnregisterGame {
      unregisterGame
    }
  `);

  const [alertMsg, displayAlertMsg] = useSnackbar(3000);

  useEffect(() => {
    if (!registerData) return;

    setBtnLoading(false);

    console.log(registerData.subscribeRegister);

    const { type, game_id, custom_host_nickname } =
      registerData.subscribeRegister;

    switch (type) {
      case RegisterNotifyType.ASKED:
        if (!custom_host_nickname) return;
        setCustomNick(custom_host_nickname);
        setMatched(true);
        break;
      case RegisterNotifyType.MATCHED:
        setRegistered(false);
        setMatched(true);
        break;
      case RegisterNotifyType.JOIN:
        setCustomNick(null);
        setMatched(false);
        history.push('/game', { game_id });
        // history.push('/game');
        break;
      case RegisterNotifyType.BOOM:
        setCustomNick(null);
        setMatched(false);
        displayAlertMsg(`Match is canceled.`);
        break;
    }
  }, [registerData]);

  const onClickPlay = async () => {
    if (registered) {
      setRegistered(false);
      await handleError(unregisterGame);
    } else {
      setRegistered(true);
      await handleError(registerGame);
    }
  };

  const errorVar = error || registerError || cancelError;

  return (
    <>
      {errorVar && <ErrorAlert name="Matching" error={errorVar} />}

      {registerData && (
        <MatchedModal
          open={matched}
          id={registerData.subscribeRegister.game_id}
          btnLoading={btnLoading}
          setBtnLoading={setBtnLoading}
          customNick={customNick}
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
