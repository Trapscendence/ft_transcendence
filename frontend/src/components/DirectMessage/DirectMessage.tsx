import { Send } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box,  Divider, Fab, IconButton, Popper, PopperPlacementType } from '@mui/material';
import { useState } from 'react';

import DirectMessageList  from './DirectMessageList'

const style = {
  // position: 'absolute' as const,
  // bottom: '-10%',
  // right: '-10%',
  // transform: 'translate(-50px, -50px)',
  width: '500px',
  maxWidth: '80vw',
  height: '500px',
  maxHeight: '50vh',
  border: '1px solid #000',
  bgcolor: 'grey.200',
  // boxShadow: 24,
  p: 4,
};

export default function DirectMessage(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };


  return (
    <Box>
      <Fab onClick={handleClick('top-end')} size="medium" sx={{ position: 'absolute' as const,
 margin: '20px',  boxShadow: 0, bottom: '0%',  right: '0%',}}>
        <Send />
      </Fab>
      <Popper open={open} anchorEl={anchorEl} placement={placement} >
              <Box sx={style} style={{outline: 'none', padding: '0'}}>
                  {/* <IconButton onClick={handleClick('top-end')} size="small">
                      <CloseIcon />
                  </IconButton> */}
                  {/* Text in a popperText in a popperText in a popperText in a popper */}
                  <Box sx={{position: 'absolute' as const, width:'30%', maxWidth:'200px', maxHeight:'100%', height:'100%', border: '1px solid #000',}}>
                    {/* <List> */}
                      <DirectMessageList nickname="friend1" />
                      <Divider />
                      <DirectMessageList nickname="friend2" />
                      <Divider />
                      <DirectMessageList nickname="friend3" />
                    {/* </List> */}
                    </Box>
                  <Box sx={{position: 'absolute' as const, width:'70%', right:'0%', height: '100%', border: '1px solid blue'}} />
                <Divider orientation='vertical'/>
              </Box>
      </Popper>

        </Box>
    )
        }
