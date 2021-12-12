import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';

import { GET_CHANNELS } from '../../../utils/Apollo/gqls';
import { GetChannelsResponse } from '../../../utils/Apollo/responseModels';
import ErrorAlert from '../../commons/ErrorAlert';
import LoadingBackdrop from '../../commons/LoadingBackdrop';
import ChannelCard from './ChannelCard';

export default function ChannelListContents(): JSX.Element {
  const { data, loading, error } = useQuery<GetChannelsResponse>(GET_CHANNELS, {
    variables: { limit: 0, offset: 0 },
  });

  return (
    <>
      {error && <ErrorAlert name="ChannelListContents" error={error} />}
      {loading && <LoadingBackdrop loading={loading} />}
      <Grid container>
        {data?.channels?.map((val) => (
          <ChannelCard key={val.id} channelSummary={val} />
        ))}
      </Grid>
    </>
  );
}
