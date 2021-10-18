import {Box, Divider} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import { Message } from './DirectMessage';
  
  interface DirectMessageListProps {
         messages:Message[],

    }
    
function DirectMessageContent ({
messages,
}: DirectMessageListProps): JSX.Element {

  const friendDmStyle = {
    background: '#262626',
    borderRadius: '0.5rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  }
  
  const myDmStyle = {
    backgroundAttachment: 'fixed',
    background: ' rgba(103, 88, 205, 1)',
    borderRadius: '0.5rem 0.2rem 0.2rem 0.5rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  }
    return (
      <Box 
        sx={{
          height: '100%',
          display:'flex', 
          flexDirection:'column',
          justifyContent: 'flex-end'
          // alignItems: 'flex-end'
      }}>
       {
            messages?.map((message) => message.received ?
            (
              <div style={friendDmStyle}>
                {message.content}
                </div>
                ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', 
                }}>
                  <div style={myDmStyle}>
                    {message.content}
                  </div>
                </div>
            ))      
        }
        <Divider light />
        <TextField fullWidth margin="dense"></TextField>
    </Box>
    );
}
  
  export default DirectMessageContent;
  