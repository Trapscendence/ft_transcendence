import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { ChannelListItem } from '../../../utils/models';

interface ChannelCardProps {
  channelSummary: ChannelListItem;
}

export default function ChannelCard({
  channelSummary,
}: ChannelCardProps): JSX.Element {
  const { title, is_private, owner, participants } = channelSummary;

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
            Participants: {participants.map((val) => val.nickname).join()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Enter channel</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

// TODO
// * Public, Private 등에 아이콘 넣기. 필터 선택에도 마찬가지...? Owner 등에도!
// * participants 백엔드를 아직 테스트 안해봤음.
// * 현재 스키마에 isPrivate이 아니라 private임. isPrivate으로 바뀌면 다시 테스트 필요
