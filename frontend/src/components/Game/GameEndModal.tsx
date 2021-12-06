import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router';

import useAchievement from '../../hooks/useAchievement';

interface GameEndModalProps {
  open: boolean;
  winner: string;
}

export default function GameEndModal({
  open,
  winner,
}: GameEndModalProps): JSX.Element {
  const history = useHistory();

  const onClickBtn = () => {
    useAchievement({ achievementId: '2' });
    history.push('/home');
  };

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
            <Typography>The game is over!</Typography>
            <Typography>Winner is {winner}.</Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={onClickBtn}>
              ok
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
