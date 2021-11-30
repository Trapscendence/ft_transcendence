import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { useInput } from '../../../hooks/useInput';
import {
  ADD_CHANNEL,
  EDIT_CHANNEL,
  GET_MY_CHANNEL,
} from '../../../utils/Apollo/gqls';
import {
  AddChannelResponse,
  EditChannelResponse,
} from '../../../utils/Apollo/responseModels';
import handleError from '../../../utils/handleError';
import ErrorAlert from '../../commons/ErrorAlert';
import LoadingBackdrop from '../../commons/LoadingBackdrop';

interface ChannelCreateModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddChannel: boolean;
}

export default function ChannelManageModal({
  open,
  setOpen,
  isAddChannel,
}: ChannelCreateModalProps): JSX.Element {
  const [title, setTitle, onChangeTitle] = useInput('');
  const [password, setPassword, onChangePassword] = useInput('');
  const [titleError, setTitleError] = useState(false);

  const [addChannelFunc, { loading, error }] = useMutation<AddChannelResponse>(
    ADD_CHANNEL,
    {
      variables: { title, password },
      refetchQueries: [GET_MY_CHANNEL],
    }
  );

  const [editChannel, { loading: editLoading, error: editError }] =
    useMutation<EditChannelResponse>(EDIT_CHANNEL, {
      variables: { title, password: password === '' ? null : password },
    });

  const btnFunction = isAddChannel ? addChannelFunc : editChannel;
  const btnText = isAddChannel ? 'make channel' : 'edit channel';

  const onClickBtn = async (): Promise<void> => {
    if (!title.length) {
      // displayAlertMsg('Please enter the title.');
      setTitleError(true);
      return;
    }

    await handleError(btnFunction);
    setOpen(false);
    setTitle('');
    setPassword('');
  };

  return (
    <>
      {error && <ErrorAlert name="ChannelCreateModal" error={error} />}
      {loading && <LoadingBackdrop loading={loading} />}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setTitle('');
          setPassword('');
        }}
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
              error={titleError}
              helperText={titleError ? 'Title must be entered.' : null}
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
              {btnText}
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}

// TODO: title 입력 안되면 에러 뜨게 프론트에서 구현
