import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
} from '@mui/material';

import { useInput } from '../../../hooks/useInput';
import { ADD_CHANNEL, GET_MY_CHANNEL } from '../../../utils/gqls';
import handleError from '../../../utils/handleError';
import { AddChannelResponse } from '../../../utils/responseModels';
import ErrorAlert from '../../commons/ErrorAlert';
import LoadingBackdrop from '../../commons/LoadingBackdrop';

interface ChannelCreateModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function ChannelCreateModal({
  open,
  handleClose,
}: ChannelCreateModalProps): JSX.Element {
  const [title, setTitle, onChangeTitle] = useInput('');
  const [password, setPassword, onChangePassword] = useInput('');

  const [addChannelFunc, { loading, error }] = useMutation<AddChannelResponse>(
    ADD_CHANNEL,
    {
      variables: { title, password },
      refetchQueries: [GET_MY_CHANNEL],
    }
  );

  const onClickBtn = async (): Promise<void> => {
    await handleError(addChannelFunc);
    handleClose();
    setTitle('');
    setPassword('');
  };

  if (loading) return <LoadingBackdrop loading={loading} />;
  if (error) return <ErrorAlert name="ChannelCreateModal" error={error} />;

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

// TODO: title 입력 안되면 에러 뜨게 프론트에서 구현
