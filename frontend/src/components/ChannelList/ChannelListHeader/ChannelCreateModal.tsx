import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { channelIdVar } from '../../..';
// import { currentChannelVar } from '../../..';
import { useInput } from '../../../hooks/useInput';
import { ADD_CHANNEL } from '../gqls';
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
  // const [id, setId] = useState<string | null>(null);
  const history = useHistory();

  // TODO: loading, error 등은 나중에 고려
  const [addChannelFunc, { data }] = useMutation<AddChannelResponse>(
    ADD_CHANNEL,
    {
      // variables: { owner_user_id: '1', title, password },
      onCompleted({ addChannel }) {
        // history.push(`/channel/${addChannel.id}`);
        channelIdVar(addChannel.id);
      },
    }
  );

  // useEffect(() => {
  //   return () => {
  //     console.log('data', data);
  //     console.log('data?.addChannel.id', data?.addChannel.id);
  //     console.log('channelIdVar', channelIdVar());
  //     if (data?.addChannel.id) channelIdVar(data?.addChannel.id);
  //   };
  // }, []);

  const onClickBtn = async (): Promise<void> => {
    console.log(title, password);
    try {
      await addChannelFunc({
        variables: { owner_user_id: '1', title, password },
      });
    } catch (e) {
      console.error(e); // TODO: 임시! 에러 처리를 어떻게 해야할지 아직 잘 모르겠음.
    }
    setTitle('');
    setPassword('');
    handleClose();
    // TODO: owner_user_id 임시! 나중에 user_id를 저장해서 보내건, 쿠키를 사용해서 이 인자가 사라지건, 추후 수정 필요.
    // TODO: 같은 user_id가 방을 만드는 등 불가능한 동작을 했을 때 어떻게 되는가? 에러가 오나? 백엔드에 물어볼 것...
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
