import { useQuery } from '@apollo/client';
import { Send } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Divider, TextField } from '@mui/material';
import { useState } from 'react';

import { DmsData, DmVars } from '../../utils/Apollo/Message';
import { GET_DM } from '../../utils/Apollo/MessageQuery';

interface DirectMessageContentProps {
  user_id: string;
  other_id: string;
}

function DirectMessageContent({
  user_id,
  other_id,
}: DirectMessageContentProps): JSX.Element {
  const friendDmStyle = {
    background: '#262626',
    borderRadius: '0.1rem 0.9rem 0.9rem 0.9rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  };

  const myDmStyle = {
    backgroundAttachment: 'fixed',
    background: ' rgba(103, 88, 205, 1)',
    borderRadius: '0.9rem 0.9rem 0.1rem 0.9rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  };

  const [loadingState, setLoadingState] = useState(false);
  const handleClick = () => {
    setLoadingState(true);
  };

  const { error, loading, data } = useQuery<DmsData, DmVars>(GET_DM, {
    variables: { user_id: '1', other_id: '2', offset: 0, limit: 5 },
  });

  // console.log(data?.DM[0]);
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end'
      }}
    >
      {data?.DM[0].messages.map((message) =>
        // ANCHOR 어째서 2중배열?
        message.received ? (
          <Box id="friend-DM" style={friendDmStyle}>
            {message.content}
          </Box>
        ) : (
          <Box
            id="mine-DM"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Box style={myDmStyle}>{message.content}</Box>
          </Box>
        )
      )}
      <Box
        id="send-container"
        sx={{
          display: 'flex',
          alignItems: 'space-between',
          justifyContent: 'space-between',
        }}
      >
        <Divider light />
        <TextField size="small" fullWidth margin="dense"></TextField>
        <LoadingButton
          onClick={handleClick}
          endIcon={<Send />}
          loading={loadingState}
          loadingPosition="end"
          variant="contained"
          sx={{
            boxShadow: 0,
            margin: '5px 0px 5px 8px',
          }}
        >
          Send
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default DirectMessageContent;
