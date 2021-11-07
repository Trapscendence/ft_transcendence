import { Paper } from '@mui/material';

import { IUser } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';

interface ParticipantsListProps {
  participants: IUser[];
}

export default function ParticipantsList({
  participants,
}: ParticipantsListProps): JSX.Element {
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
