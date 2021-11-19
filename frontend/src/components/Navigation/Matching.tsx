import { useMutation, useSubscription } from '@apollo/client';
import { VideogameAsset } from '@mui/icons-material';
import { CircularProgress, Tab } from '@mui/material';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { SUBSCRIBE_MATCH } from '../../utils/Apollo/gqls';
import { SubscribeMatchResponse } from '../../utils/Apollo/responseModels';
import handleError from '../../utils/handleError';
import ErrorAlert from '../commons/ErrorAlert';
import MatchedModal from './MatchedModal';

export default function Matching(): JSX.Element {
  const [registered, setRegistered] = useState(false);
  const [matched, setMatched] = useState(false);
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

  useEffect(() => {
    console.log(matchData, registered);

    if (!matchData) {
      return;
    }

    setRegistered(false);
    setMatched(true);
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
          id={matchData.subscribeMatch}
        />
      )}
      <Box
        onClick={onClickPlay}
        sx={{ position: 'relative', cursor: 'pointer' }}
      >
        <Tab
          icon={<VideogameAsset />}
          // disabled={loading}
          sx={{ color: registered ? 'text.disabled' : '' }}
          onClick={() => history.push('/game')}
        />
        {registered && (
          <CircularProgress
            // color="secondary"
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
