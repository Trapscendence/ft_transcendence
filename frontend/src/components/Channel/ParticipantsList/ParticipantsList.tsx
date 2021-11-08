import { List, Paper, Stack } from '@mui/material';
import { Box } from '@mui/system';

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
      <List>
        {participants.map((val) => {
          return (
            <Box sx={{ display: 'inline-block' }}>
              <UserSummary
                key={val.id}
                avatar={val.avatar}
                nickname={val.nickname}
              />
            </Box>
          );
        })}
      </List>
    </Paper>
  );
}
