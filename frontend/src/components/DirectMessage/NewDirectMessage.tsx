import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState } from 'react';

function NewDirectMessage(): JSX.Element {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}
    >
      <Button
        variant="contained"
        disabled
        size="medium"
        sx={{ margin: '5px', width: '10px' }}
      >
        다음
      </Button>
      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        label={'사용자 검색'}
        margin="dense"
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      ></TextField>
    </Box>
  );
}

export default NewDirectMessage;
