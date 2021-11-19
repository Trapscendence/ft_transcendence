import { Box, Stack, Typography } from '@mui/material';

interface DMContentBoxProps {
  content: string;
  received: boolean;
  time_stamp: string;
}
//ANCHOR received에 따른 메시지박스 출력
export default function DMContentBox({
  content,
  received,
  time_stamp,
}: DMContentBoxProps): JSX.Element {
  const friendDmStyle = {
    background: '#262626',
    borderRadius: '0.1rem 0.9rem 0.9rem 0.9rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  };

  const myDmStyle = {
    backgroundAttachment: 'fixed',
    background: ' rgba(103, 88, 205, 1)',
    borderRadius: '0.9rem 0.9rem 0.1rem 0.9rem',
    color: '#fff',
    height: 'fit-content',
    width: 'fit-content',
    padding: '0.5rem 1rem',
    margin: '0.12rem 0.5rem',
  };

  return received ? (
    <Stack
      // direction="row"
      // justifyContent="flex-start"
      justifyContent="flex-end"
      spacing={0}
    >
      <Box id="friend-DM" style={friendDmStyle}>
        {content}
      </Box>
      <Typography variant="caption" display="block" gutterBottom>
        {new Date(+time_stamp).toLocaleString('ko-kr', {
          // year: 'numeric',
          // month: 'numeric',
          // day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit',
        })}{' '}
      </Typography>
    </Stack>
  ) : (
    <Box
      id="mine-DM"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Box style={myDmStyle}>{content}</Box>
      <Typography variant="caption" display="block" gutterBottom>
        {new Date(+time_stamp).toLocaleString('ko-kr', {
          // year: 'numeric',
          // month: 'numeric',
          // day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit',
        })}
      </Typography>
    </Box>
  );
}
