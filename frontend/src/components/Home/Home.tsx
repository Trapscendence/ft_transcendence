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

    const handleNotice = () => {};

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
      <div
        style={{
          overflow: 'scroll',
          width: '300px',
          maxHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              새 공지를 입력해보세요.
            </Typography>
          </Box>
        </Modal>

        {data?.Notices.map((notice, index) => {
          return (
            <Card
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
        {data != undefined && data.Notices.length > 4 ? (
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
