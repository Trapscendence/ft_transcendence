import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { ChannelListSummary } from '../../../utils/models';

interface ChannelCardProps {
  channelSummary: ChannelListSummary;
}

export default function ChannelCard({
  channelSummary,
}: ChannelCardProps): JSX.Element {
  const { id, title, is_private, owner, participants } = channelSummary;

  const [enterChannel] = useMutation<EnterChannelResponse>(ENTER_CHANNEL, {
    // variables: { channel_id: id, user_id: userIdVar() },
    refetchQueries: [GET_CURRENT_CHANNEL],
  });

  const onClickBtn = () => {
    void enterChannel({ variables: { channel_id: id, user_id: userIdVar() } });
  };

  return (
    <Grid item xs={6} p={3}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {is_private ? 'Private' : 'Public'}
          </Typography>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Owner: {owner.nickname}
          </Typography>
          <Typography variant="body2">
            Participants: {participants.map((val) => val.nickname).join(', ')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={onClickBtn}>
            Enter channel
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

// TODO
// * Public, Private 등에 아이콘 넣기. 필터 선택에도 마찬가지...? Owner 등에도!
