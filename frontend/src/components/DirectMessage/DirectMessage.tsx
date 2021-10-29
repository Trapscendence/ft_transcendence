import { Send } from '@mui/icons-material';
// import CloseIcon from '@mui/icons-material/Close';
import {
  Badge,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Fab,
  List,
  Paper,
  Popper,
  PopperPlacementType,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import DirectMessageContent from './DirectMessageContent';
import DirectMessageList from './DirectMessageList';
import NewDirectMessage from './NewDirectMessage';

const style = {
  // position: 'absolute' as const,
  // bottom: '-10%',
  // right: '-10%',
  // transform: 'translate(-50px, -50px)',
  width: '500px',
  maxWidth: '60vw',
  height: '500px',
  maxHeight: '50vh',
  // border: '1px solid #000',
  bgcolor: 'grey.200',
  // boxShadow: 24,
  p: 4,
};

export interface Message {
  id?: number;
  received: boolean;
  content: string;
  date: number;
}

interface Dm {
  id: number;
  name: string;
  messages: Message[];
  lastCheckDate?: number;
  lastMessageDate?: number;
}

export default function DirectMessage(): JSX.Element {
  //message에서 received가 참이면 받은 DM이고 아니면 보낸 DM임
  // const dm: Dm[] = [
  //   {
  //     name: 'seohchoi',
  //     id: 1,
  //     lastMessageDate: 14,
  //     messages: [
  //       { received: true, content: '받은메시지14', date: 20211018 },
  //       { received: true, content: '받은메시지14-2', date: 20211018 },
  //       { received: false, content: '보낸메세지14', date: 20211018 },
  //       { received: false, content: '보낸메세지14-2', date: 20211018 },
  //     ],
  //   },
  //   {
  //     name: 'qwer',
  //     id: 2,
  //     lastMessageDate: 13,
  //     messages: [
  //       { received: true, content: '받은메시지13', date: 20211018 },
  //       { received: false, content: '보낸메세지13', date: 20211018 },
  //     ],
  //   },
  //   {
  //     name: 'hola3',
  //     id: 3,
  //     lastMessageDate: 12,
  //     messages: [
  //       { received: true, content: '받은메시지12', date: 20211018 },
  //       { received: false, content: '보낸메세지12', date: 20211018 },
  //     ],
  //   },
  //   {
  //     name: 'hola4',
  //     id: 4,
  //     lastMessageDate: 11,
  //     messages: [
  //       { received: true, content: '받은메시지11', date: 20211018 },
  //       { received: false, content: '보낸메세지11', date: 20211018 },
  //     ],
  //   },
  // ];

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleButtonClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const handleClickAway = () => {
    setOpen(false);
  };

  const [newDm, setNewDm] = useState(false);
  const newDmHandler = () => {
    setNewDm(!newDm);
  };
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <Fab
          onClick={handleButtonClick('top-end')}
          size="medium"
          sx={{
            position: 'fixed',
            margin: '20px',
            // boxShadow: 0,
            bottom: '0%',
            right: '200px',
          }}
        >
          <Badge
            variant="dot"
            badgeContent={4}
            overlap="circular"
            color="primary"
          >
            <Send />
          </Badge>
        </Fab>

        <Popper open={open} anchorEl={anchorEl} placement={placement}>
          <Paper
            elevation={5}
            sx={style}
            style={{ outline: 'none', padding: '0' }}
          >
            <List
              sx={{
                position: 'absolute' as const,
                overflowX: 'hidden',
                width: '35%',
                maxWidth: '300px',
                maxHeight: '100%',
                height: '100%',
              }}
            >
              {dms.map((dm) => (
                <Box>
                  <DirectMessageList
                    {...{ selectedIndex, setSelectedIndex, setNewDm }}
                    nickname={dm.name}
                    ID={dm.id}
                  />
                  <Divider light />
                </Box>
              ))}
            </List>
            <Box
              // elevation={0}
              // square
              sx={{
                position: 'absolute' as const,
                width: '65%',
                right: '1px',
                borderRadius: '0rem 0.2rem 0.2rem 0rem',
                // height: '99.2%',
                height: '100%',
                padding: '10px',
                backgroundColor: 'white',
                overflowX: 'hidden',
              }}
            >
              {/* //ANCHOR 삼항연산자 중첩 수정 필요  */}
              {selectedIndex ? (
                <DirectMessageContent
                  messages={dms[selectedIndex - 1].messages}
                />
              ) : newDm ? (
                <NewDirectMessage />
              ) : (
                <Box
                  id="DM-nonselected"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5%',
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    sx={{ bottom: '0%' }}
                  >
                    선택된 쪽지가 없습니다.
                    <br />
                    <Typography variant="body2" component="div">
                      기존 쪽지 중 하나를 선택하거나
                      <br />새 쪽지를 작성하세요.
                    </Typography>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={newDmHandler}
                      sx={{ margin: '20px 0px 0px 0px' }}
                    >
                      새 쪽지
                    </Button>
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
