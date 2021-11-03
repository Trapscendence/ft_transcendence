import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
} from '@mui/material';

import { useInput } from '../../../hooks/useInput';

interface ChannelCreateModalProps {
  open: boolean;
  handleClose: () => any; // 수정 필요
}

export default function ChannelCreateModal({
  open,
  handleClose,
}: ChannelCreateModalProps): JSX.Element {
  const [title, setTitle, onChangeTitle] = useInput('');
  const [password, setPassword, onChangePassword] = useInput('');
  // const onClickBtn = async (): Promise<void> => {
  const onClickBtn = (): void => {
    console.log(title, password);
    // try {
    //   await postSignin({ variables: { id, password } });
    // } catch (e) {
    //   console.error(e);
    // }
    setTitle('');
    setPassword('');
  };

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
            label="Title*"
            variant="filled"
            size="small"
            margin="dense"
            sx={{ width: '100%' }}
            value={title}
            onChange={onChangeTitle}
          />
          <TextField
            label="Password"
            variant="filled"
            size="small"
            margin="dense"
            helperText="If you do not enter a password, it will be created as a public room."
            sx={{ width: '100%' }}
            value={password}
            onChange={onChangePassword}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={onClickBtn}>
            Make Channel
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}
