import { useMutation } from '@apollo/client';
import { FormControl, FormLabel } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from '@mui/material';
import gql from 'graphql-tag';
import { useState } from 'react';

interface CustomGameModalProps {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomGameModal({
  id,
  open,
  setOpen,
}: CustomGameModalProps) {
  const [isPaddleNormal, setIsPaddleNormal] = useState(true);
  const [isBallNormal, setIsBallNormal] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [makeCustomGame] = useMutation<{ makeCustomGame: boolean }>(gql`
    mutation MakeCustomGame(
      $target_id: ID!
      $isBallNormal: Boolean!
      $isPaddleNormal: Boolean!
    ) {
      makeCustomGame(
        target_id: $target_id
        isBallNormal: $isBallNormal
        isPaddleNormal: $isPaddleNormal
      )
    }
  `);

  const handleChangePaddle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaddleNormal((event.target as HTMLInputElement).value === 'normal');
  };

  const handelChangeBall = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBallNormal((event.target as HTMLInputElement).value === 'normal');
  };

  const onClickBtn = async () => {
    console.log(isPaddleNormal, isBallNormal);

    setBtnLoading(true);
    await makeCustomGame({
      variables: {
        target_id: id,
        isBallNormal,
        isPaddleNormal,
      },
    });
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
                value={isPaddleNormal ? 'normal' : 'hard'}
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
                value={isBallNormal ? 'normal' : 'hard'}
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
            <LoadingButton
              loading={btnLoading}
              variant="contained"
              onClick={onClickBtn}
            >
              make custom game
            </LoadingButton>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
