/* eslint-disable */
// import { Redirect } from 'react-router';

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Drawer,
  List,
  ListItem,
  Modal,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { NoticeData, NoticeVars } from '../../utils/Apollo/Home';
import { GET_NOTICES } from '../../utils/Apollo/HomeQuery';
import GameEndModal from '../Game/GameEndModal';

function Home(): JSX.Element {
  const location = useLocation<{ winner: { nickname: string } }>();

  if (!location.state)
    return (
      <div>
        <Notices />
      </div>
    );

  const { winner } = location.state;

  function Notices(): JSX.Element {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    //NOTE offset이 바뀌어서 usequery가 실행되는거고... useQuery는 원래 한번만 실행된다...(헐...)
    const { data } = useQuery<NoticeData, NoticeVars>(GET_NOTICES, {
      variables: {
        offset: offset,
        limit: limit,
      },
    });

    const handleClick = () => {
      setOffset(offset + 5);
    };

    //TODO achieve 목록 쫙 확인해서 checked가 아닌 achieve 있으면 모달 띄워줘야함
    /*


  const [checkAchieved, { error: checkError }] = useMutation<{
    achievement_id: string;
  }>(gql`
    mutation checkAchieved {
      checkAchieved
    }
  `);
  checkAchieved({
    variables: { achievement_id: achievementId },
  })
    */

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
      <div>
        <Typography>Created by gmoon, jolim, seohchoi & seyu</Typography>

        <div
          style={{
            overflow: 'scroll',
            width: '300px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {data?.notices.map((notice, index) => {
            return (
              <Card
                key={notice.time_stamp}
                sx={{
                  maxWidth: 275,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={
                  () => handleOpen()
                  // , setContent(notice.time_stamp)
                }
              >
                <CardContent>
                  <Typography>제목: {notice.title}</Typography>
                  <Typography gutterBottom>{notice.writer.nickname}</Typography>
                  <Typography gutterBottom>내용: {notice.contents}</Typography>
                </CardContent>
              </Card>
            );
          })}
          {data != undefined && data.notices.length > 4 ? (
            <Button
              onClick={() => handleClick()}
              variant="contained"
              sx={{
                boxShadow: 0,
                margin: '5px 0px 5px 8px',
              }}
            >
              이전 공지 가져오기
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {winner && <GameEndModal open={!!winner} winner={winner.nickname} />}
      <Notices />
    </>
  );
}

export default Home;
