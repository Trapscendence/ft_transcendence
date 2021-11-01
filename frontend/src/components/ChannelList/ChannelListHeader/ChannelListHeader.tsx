import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Box } from '@mui/system';

export default function ChannelListHeader(): JSX.Element {
  return (
    <Box display="flex" alignItems="center">
      <Button variant="contained" color="secondary" sx={{ m: 1, p: 2 }}>
        Create a new channel
      </Button>
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
