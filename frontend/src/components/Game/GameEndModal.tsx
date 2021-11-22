import { Button, CardContent, Modal, Typography } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import { Card, CardActions } from '@mui/material';

interface GameEndModalProps {
  open: boolean;
}

export default function GameEndModal({ open }: GameEndModalProps): JSX.Element {
  return (
    <>
      <Modal
        open={open}
        // onClose={handleClose} // NOTE: 외부 클릭해도 모달 꺼지지 않게 하려면 onClose 옵션을 안줘야
      >
        <Card
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CardContent>
            <Typography>
              Game is matched! Would you like to join the game?
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              // disabled={btnLoading}
              // onClick={onClickNo}
            >
              exit game
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
