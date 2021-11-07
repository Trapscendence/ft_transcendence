import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
} from '@mui/material';

import { userIdVar } from '../../..';
// import { channelIdVar } from '../../..';
// import { currentChannelVar } from '../../..';
import { useInput } from '../../../hooks/useInput';
import { ADD_CHANNEL, GET_CURRENT_CHANNEL } from '../gqls';
import { AddChannelResponse } from '../responseModels';

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

  // TODO: loading, error 등은 나중에 고려
  const [addChannelFunc] = useMutation<AddChannelResponse>(ADD_CHANNEL);

  const onClickBtn = async (): Promise<void> => {
    try {
      await addChannelFunc({
        variables: { owner_user_id: userIdVar(), title, password },
        refetchQueries: [GET_CURRENT_CHANNEL, 'GetCurrentChannel'], // TODO: 맞나?
      });
    } catch (e) {
      console.error(e); // TODO: 임시! 에러 처리를 어떻게 해야할지 아직 잘 모르겠음.
    }

    handleClose();
    setTitle('');
    setPassword('');

    // TODO: owner_user_id 임시! 나중에 user_id를 저장해서 보내건, 쿠키를 사용해서 이 인자가 사라지건, 추후 수정 필요.
    // TODO: 같은 user_id가 방을 만드는 등 불가능한 동작을 했을 때 어떻게 되는가? 에러가 오나?
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

// TODO: title 입력 안되면 에러 뜨게 구현
// TODO: addChannel 등에 owner_user_id 전달하지 않게 변경될 예정... 추후 프론트도 수정 필요
