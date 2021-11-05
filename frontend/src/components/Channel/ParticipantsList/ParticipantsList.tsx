import { Paper } from '@mui/material';

// import { ChannelNotifySummary } from '../../../utils/models';
import { GetCurrentChannelResponse } from '../../ChannelList/responseModels';
import UserSummary from '../../commons/UserSummary';

interface ParticipantsListProps {
  // notify: ChannelNotifySummary | undefined;
  channelData: GetCurrentChannelResponse;
}

export default function ParticipantsList({
  channelData,
}: ParticipantsListProps): JSX.Element {
  const {
    user: {
      channel: { participants },
    },
  } = channelData;

  return (
    <Paper variant="outlined" sx={{ my: 3 }}>
      {participants.map((val) => {
        return (
          <UserSummary
            key={val.id}
            avatar={val.avatar}
            nickname={val.nickname}
          />
        );
      })}
    </Paper>
  );
}

// TODO: 하나만 있으면 폭이 100%? 인 이슈가 있음. UserSummary에서 수정해야 할지...
