import { useMutation } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useHistory } from 'react-router';

import { userIdVar } from '../../..';
import { UserSummary } from '../../../utils/models';
import { GetCurrentChannelResponse } from '../../ChannelList/responseModels';
import { LEAVE_CHANNEL } from '../gqls';
import { LeaveChannelResponse } from '../responseModels';

interface ChannelHeaderProps {
  // id: string;
  title: string;
  is_private: boolean;
  owner: UserSummary;
  administrators: UserSummary[];
}

export default function ChannelHeader({
  title,
  is_private,
  owner,
  administrators,
}: ChannelHeaderProps): JSX.Element {
  const history = useHistory();

  const [leaveChannel, { data: leaveData }] = useMutation<LeaveChannelResponse>(
    LEAVE_CHANNEL,
    {
      // variables: { channel_id: channelId, user_id: userId },
      onCompleted: () => {
        // channelIdVar(null); // TODO: 이렇게 하면 안될것같은데 // 위로 올리면 얼리리턴일텐데
        history.push('/channel');
      },
    }
  );
  // useEffect(() => {
  //   return () => {
  //     console.log('leaveData?.leaveChannel', leaveData?.leaveChannel);
  //     console.log('channelIdVar', channelIdVar());
  //     console.log('leaveData', leaveData);
  //     if (leaveData?.leaveChannel) {
  //       // TODO: 조건문에 쓰면 안되려나..?
  //       channelIdVar(null);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log('leaveData', leaveData);
  //   // channelIdVar(null);
  //   if (leaveData?.leaveChannel) channelIdVar(null);
  // }, [leaveData]);

  const onClickLeave = () => {
    void leaveChannel({
      // variables: { channel_id: channelIdVar(), user_id: userIdVar() },
    });

    // // return <Redirect to="/channel" />;
    // // history.push('/channel');
    // history.push('/rank');
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography>Title: {title}</Typography>
        <Typography>Owner: {owner.nickname}</Typography>
      </Box>
      <Box>
        <Button variant="contained" onClick={onClickLeave}>
          Leave Channel
        </Button>
      </Box>
    </Paper>
  );
}
