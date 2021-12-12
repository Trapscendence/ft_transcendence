import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
} from '@mui/material';

import { useInput } from '../../../hooks/useInput';
import { EnterChannelResponse } from '../../../utils/Apollo/responseModels';

interface EnterChannelModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  channel_id: string;
  enterChannel: (
    options?:
      | MutationFunctionOptions<
          EnterChannelResponse,
          OperationVariables,
          DefaultContext,
          ApolloCache<unknown>
        >
      | undefined
  ) => Promise<unknown>;
}

export default function EnterChannelModal({
  open,
  setOpen,
  channel_id,
  enterChannel,
}: EnterChannelModalProps): JSX.Element {
  const [password, setPassword, onChangePassword] = useInput('');

  const onClickBtn = async () => {
    try {
      await enterChannel({ variables: { channel_id, password } });
      setOpen(false);
      setPassword('');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
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
              label="Password"
              variant="filled"
              size="small"
              margin="dense"
              sx={{ width: '100%' }}
              value={password}
              onChange={onChangePassword}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={onClickBtn}>
              enter channel
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}

// TODO: title 입력 안되면 에러 뜨게 프론트에서 구현
