import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { userIdVar } from '../../..';
import { ENTER_CHANNEL, GET_MY_CHANNEL } from '../../../utils/gqls';
import { IChannelListItem } from '../../../utils/models';
import { EnterChannelResponse } from '../../../utils/responseModels';
import ErrorAlert from '../../commons/ErrorAlert';
import LoadingBackdrop from '../../commons/LoadingBackdrop';

interface ChannelCardProps {
  channelSummary: IChannelListItem;
}

export default function ChannelCard({
  channelSummary,
}: ChannelCardProps): JSX.Element {
  const { id, title, is_private, owner, participants } = channelSummary;

  const [enterChannel, { loading, error }] = useMutation<EnterChannelResponse>(
    ENTER_CHANNEL,
    {
      refetchQueries: [GET_MY_CHANNEL],
    }
  );

  const onClickBtn = () => {
    void enterChannel({ variables: { channel_id: id, user_id: userIdVar() } });
  };

  if (error) return <ErrorAlert error={error} />;

  return (
    <Grid item xs={6} p={3}>
      <LoadingBackdrop loading={loading} />
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
