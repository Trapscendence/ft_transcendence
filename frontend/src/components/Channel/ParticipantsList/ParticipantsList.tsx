import { useReactiveVar } from '@apollo/client';
import { Paper } from '@mui/material';

import { currentChannelVar } from '../../..';
import UserSummary from '../../commons/UserSummary';

export default function ParticipantsList(): JSX.Element {
  const currentChannel = useReactiveVar(currentChannelVar);
  // TODO: 이걸 저장하는게 맞는지... 실시간 정보 반영은 어떤식으로 할건지...

  return (
    <Paper variant="outlined" sx={{ my: 3 }}>
      {currentChannel?.participants.map((val) => {
        console.log(val);
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
