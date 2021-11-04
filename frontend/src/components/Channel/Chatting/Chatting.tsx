import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';

import { useInput } from '../../../hooks/useInput';

export default function Chatting(): JSX.Element {
  const [input, setInput, onChangeInput] = useInput('');

  const onClickBtn = () => {
    console.log(input);
    setInput('');
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '79vh', p: 2 }}>
      <CardContent sx={{ height: '90%' }}>
        <Box></Box>
      </CardContent>
      <CardActions sx={{ width: '100%', height: '10%' }}>
        <TextField
          label="message"
          variant="filled"
          size="small"
          sx={{ width: '100%', mr: 2 }}
          value={input}
          onChange={onChangeInput}
        />
        <Button variant="contained" onClick={onClickBtn}>
          Send
        </Button>
      </CardActions>
    </Card>
  );
}

// TODO: 85vh, 90% 이런식으로 말고 더 나은 방법은 없을까?
// TODO: 90%, 10% 이런거 너무 마음에 안드는데...
