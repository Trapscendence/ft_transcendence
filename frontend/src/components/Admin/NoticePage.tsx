/* eslint-disable */
import { useMutation, useQuery } from '@apollo/client';
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
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { DELETE_NOTICE, WRITE_NOTICE } from '../../utils/Apollo/Adminquery';
import { Notice, NoticeData, NoticeVars } from '../../utils/Apollo/Home';
import { GET_NOTICES } from '../../utils/Apollo/HomeQuery';

function NoticePage(): JSX.Element {
  const { data } = useQuery<NoticeData, NoticeVars>(GET_NOTICES, {
    variables: {
      offset: 0,
      limit: 100,
    },
  });

  const [deleteNotice, { data: DeleteNoticeData }] =
    useMutation<{ time_stamp: string }>(DELETE_NOTICE);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [inputSpace, setInputSpace] = useState<string>('');
  const [titleSpace, setTitleSpace] = useState<string>('');
  const onchangeInput = (e: React.FormEvent<HTMLInputElement>) =>
    setInputSpace(e.currentTarget.value);
  const onchangeTitle = (e: React.FormEvent<HTMLInputElement>) =>
    setTitleSpace(e.currentTarget.value);

  const [writeNotice, { data: writeNoticeError }] =
    useMutation<{ content: string; title: string }>(WRITE_NOTICE);

  //TODO 권한 없을경우 권한이 없습니다. 띄우게하기
  return (
    <div style={{ height: '90%', width: '100%' }}>
      <Button variant="contained" onClick={handleOpen}>
        새 글 작성
      </Button>
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
          <Stack spacing={1} alignItems="center">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setErrorMessage('');
                if (inputSpace == '' || titleSpace == '')
                  setErrorMessage('빈 내용을 쓸 수 없습니다.');
                else if (inputSpace.length > 140 || titleSpace.length > 140)
                  setErrorMessage(
                    '140자가 넘는 공지는 쓸 수 없습니다.' +
                      ' 현재 제목 글자수 : ' +
                      titleSpace.length.toString() +
                      ' 현재 내용 글자수 : ' +
                      inputSpace.length.toString()
                  );
                else {
                  writeNotice({
                    variables: { contents: inputSpace, title: titleSpace },
                  })
                    .then(() => window.location.replace('/admin/Notice'))
                    .catch(() => setErrorMessage('작성 실패!'));
                }
              }}
            >
              <Typography> 제목</Typography>
              <input onChange={onchangeTitle}></input>
              <Typography> 내용</Typography>
              <input onChange={onchangeInput}></input>
              <Button variant="contained" type="submit">
                작성
              </Button>
            </form>
            {errorMessage ? errorMessage : ''}
          </Stack>
        </Box>
      </Modal>
      {data &&
        data.notices.map((notice, index) => {
          return (
            <Card
              key={notice.time_stamp}
              sx={{
                maxWidth: 275,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography>제목: {notice.title}</Typography>
                <Typography gutterBottom>{notice.writer.nickname}</Typography>
                <Typography gutterBottom>{notice.time_stamp}</Typography>
                <CardActions>
                  <Button
                    onClick={() =>
                      deleteNotice({
                        variables: { time_stamp: notice.time_stamp },
                      })
                    }
                    size="small"
                  >
                    삭제하기
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
export default NoticePage;
