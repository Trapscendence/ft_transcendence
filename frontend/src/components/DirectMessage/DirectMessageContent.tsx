import { Send } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Divider, TextField } from '@mui/material';
import { useState } from 'react';

import { Message } from './DirectMessage';

interface DirectMessageListProps {
  messages: Message[];
}

function DirectMessageContent({
  messages,
}: DirectMessageListProps): JSX.Element {
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

  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
  };

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
      {messages?.map((message) =>
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
        <TextField fullWidth margin="dense"></TextField>
        <LoadingButton
          onClick={handleClick}
          endIcon={<Send />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          sx={{
            boxShadow: 0,
            margin: '10px',
          }}
        >
          Send
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default DirectMessageContent;
