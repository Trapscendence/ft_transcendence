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
  
    return (
      <Box sx={{bottom: '0%'}}>
       {
            messages?.map((message) => message.received ?
            (
                message.content
                ) : (
                message.content
            ))      
        }
        <Divider light />
        <TextField fullWidth margin="dense"></TextField>
    </Box>
    );
}
  
  export default DirectMessageContent;
  