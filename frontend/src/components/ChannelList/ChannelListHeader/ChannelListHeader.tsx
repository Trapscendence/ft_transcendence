import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
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
    <Box display="flex" alignItems="center" mt={-2}>
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 1, p: 2 }}
        onClick={handleOpen}
      >
        Create a new channel
      </Button>
      <ChannelCreateModal {...{ open, handleClose }} />
      <Button variant="contained" color="secondary" sx={{ m: 1, p: 2 }}>
        Random channel
      </Button>
      <Box sx={{ m: 1 }}>
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
      </Box>
    </Box>
  );
}
