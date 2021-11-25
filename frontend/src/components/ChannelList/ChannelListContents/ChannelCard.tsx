import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { ENTER_CHANNEL, GET_MY_CHANNEL } from '../../../utils/Apollo/gqls';
import { IChannelListItem } from '../../../utils/Apollo/models';
import { EnterChannelResponse } from '../../../utils/Apollo/responseModels';
import handleError from '../../../utils/handleError';
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
      variables: { channel_id: id },
    }
  );

  return (
    <>
      {error && <ErrorAlert name="ChannelCard" error={error} />}
      {loading && <LoadingBackdrop loading={loading} />}
      <Grid item xs={6} p={3}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
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
            <Button size="small" onClick={() => handleError(enterChannel)}>
              Enter channel
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
