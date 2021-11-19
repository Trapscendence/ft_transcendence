import { Typography } from '@material-ui/core';
import { Button, Card, CardActions, CardContent, Modal } from '@mui/material';

interface MatchedModalProps {
  open: boolean;
  handleClose: () => void;
  id: string;
}

export default function MatchedModal({
  open,
  handleClose,
  id,
}: MatchedModalProps): JSX.Element {
  const onClickBtn = () => {
    //
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
            <Button variant="contained" onClick={onClickBtn}>
              yes
            </Button>
            <Button variant="contained" onClick={handleClose}>
              no
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
