import { Paper } from '@mui/material';

import { IUser } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';

interface ParticipantsListProps {
  participants: IUser[]; // TODO: 맞나?
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

// TODO: 하나만 있으면 폭이 100%? 인 이슈가 있음. UserSummary에서 수정해야 할지...
