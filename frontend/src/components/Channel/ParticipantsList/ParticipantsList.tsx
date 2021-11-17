import { List, Paper } from '@mui/material';
import { Box } from '@mui/system';

import { IUser } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';

interface ParticipantsListProps {
  id: string;
  participants: IUser[];
}

export default function ParticipantsList({
  id,
  participants,
}: ParticipantsListProps): JSX.Element {
  return (
    <Paper variant="outlined" sx={{ my: 3 }}>
      <List>
        {participants.map((val) => {
          return (
            <Box key={val.id} sx={{ display: 'inline-block' }}>
              <UserSummary IUser={val} channelId={id} />
            </Box>
          );
        })}
      </List>
    </Paper>
  );
}
