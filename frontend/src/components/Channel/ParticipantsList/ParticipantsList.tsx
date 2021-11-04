import { useQuery, useReactiveVar } from '@apollo/client';
import { Paper } from '@mui/material';

import { userIdVar } from '../../..';
import { ChannelNotifySummary } from '../../../utils/models';
import UserSummary from '../../commons/UserSummary';
import { GET_CURRENT_PARTICIPANTS } from '../gqls';
import { GetCurrentParticipantsResponse } from '../responseModels';

interface ParticipantsListProps {
  notify: ChannelNotifySummary | undefined;
}

export default function ParticipantsList({
  notify,
}: ParticipantsListProps): JSX.Element {
  // const currentChannel = useReactiveVar(currentChannelVar);
  // TODO: 이걸 저장하는게 맞는지... 실시간 정보 반영은 어떤식으로 할건지...

  const userId = useReactiveVar(userIdVar);

  const { data } = useQuery<GetCurrentParticipantsResponse>(
    GET_CURRENT_PARTICIPANTS,
    {
      variables: { id: userId },
    }
  );

  return (
    <Paper variant="outlined" sx={{ my: 3 }}>
      {data &&
        data?.user?.channel?.participants.map((val) => {
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
// TODO: title, is_private 등도 보여야 하는데...
// TODO: 32: 지옥의 옵셔널 체이닝... 어떻게 하지?
