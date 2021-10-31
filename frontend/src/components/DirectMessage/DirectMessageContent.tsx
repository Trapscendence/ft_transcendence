import { useQuery } from '@apollo/client';
import { Send } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
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
    // goToBottom();
  };

  const { error, loading, data } = useQuery<DmsData, DmVars>(GET_DM, {
    variables: { user_id: user_id, other_id: other_id, offset: 0, limit: 10 },
  });

  // const messagesEndRef = useRef();
  // const scrollToBottom = () => {
  //   window.HTMLElement.prototype.scrollIntoView = function() {};
  // //   this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
  // }

  // const goToBottom = () => {
  //   window.scrollTo(0, document.body.scrollHeight);
  //   console.log('흑흑 ');
  // };

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
      <Box
        id="content-container"
        sx={{
          overflowY: 'scroll',
        }}
        // ref={messagesEndRef}
      >
        {data?.DM?.messages != undefined &&
          data.DM.messages.map((message) =>
            message.received ? (
              <Stack
                // direction="row"
                // justifyContent="flex-start"
                justifyContent="flex-end"
                spacing={0}
              >
                <Box id="friend-DM" style={friendDmStyle}>
                  {message.content}
                </Box>
                <Typography variant="caption" display="block" gutterBottom>
                  {new Date(+message?.time_stamp).toLocaleString('ko-KR')}
                </Typography>
              </Stack>
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
                <Typography variant="caption" display="block" gutterBottom>
                  {new Date(+message?.time_stamp).toLocaleString('ko-KR')}
                </Typography>
              </Box>
            )
          )}
      </Box>

      <Box
        id="send-container"
        sx={{
          display: 'flex',
          alignItems: 'space-between',
          justifyContent: 'space-between',
          bottom: '0',
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
