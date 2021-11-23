import { FormControl, FormLabel } from '@material-ui/core';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useRadioGroup } from '@mui/material/RadioGroup';
import { useState } from 'react';

interface CustomGameModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomGameModal({
  open,
  setOpen,
}: CustomGameModalProps) {
  const [paddle, setPaddle] = useState('normal');
  const [ball, setBall] = useState('normal');

  const handleChangePaddle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaddle((event.target as HTMLInputElement).value);
  };

  const handelChangeBall = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBall((event.target as HTMLInputElement).value);
  };

  const onClickBtn = () => {
    console.log(paddle, ball);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Card
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel component="legend">Paddle length</FormLabel>
              <RadioGroup
                row
                aria-label="paddle"
                value={paddle}
                onChange={handleChangePaddle}
                name="paddle-length"
                sx={{ mb: 1 }}
              >
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="Normal"
                />
                <FormControlLabel
                  value="hard"
                  control={<Radio />}
                  label="Hard"
                />
              </RadioGroup>
              <FormLabel component="legend">Ball speed</FormLabel>
              <RadioGroup
                row
                aria-label="ball"
                name="ball-speed"
                value={ball}
                onChange={handelChangeBall}
              >
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="Normal"
                />
                <FormControlLabel
                  value="hard"
                  control={<Radio />}
                  label="Hard"
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={onClickBtn}>
              make custom game
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
