import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

import ChannelCreateModal from './ChannelCreateModal';

export default function ChannelListHeader(): JSX.Element {
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    // <Box display="flex" alignItems="center" mt={-2}>
    <Box display="flex" alignItems="center">
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 1, p: 2 }}
        onClick={handleOpen}
      >
        Create a new channel
      </Button>
      {/* <Button variant="contained" color="secondary" sx={{ m: 1, p: 2 }}>
        Random channel
      </Button> */}
      {/* <Box sx={{ m: 1 }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Public"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Private"
          />
        </FormGroup>
      </Box> */}
      <ChannelCreateModal {...{ open, handleClose }} />
    </Box>
  );
}

// TODO: Random, 필터링 기능은 트센 필수 사항 모두 완료되면 추가 구현할 것
