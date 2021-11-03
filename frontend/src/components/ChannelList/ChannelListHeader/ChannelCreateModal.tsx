import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

interface ChannelCreateModalProps {
  open: boolean;
  handleClose: () => any; // 수정 필요
}

export default function ChannelCreateModal({
  open,
  handleClose,
}: ChannelCreateModalProps): JSX.Element {
  return (
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
          <TextField
            label="Title"
            variant="filled"
            size="small"
            margin="dense"
            sx={{ width: '100%' }}
          />
          <TextField
            label="Password"
            variant="filled"
            size="small"
            margin="dense"
            sx={{ width: '100%' }}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained">Make Channel</Button>
        </CardActions>
      </Card>
    </Modal>
  );
}
