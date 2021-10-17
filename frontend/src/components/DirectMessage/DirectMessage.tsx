import { Send } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box,  Divider,Fab, IconButton, List, ListItem,Popper, PopperPlacementType } from '@mui/material';
import { useState } from 'react';

import DirectMessageList  from './DirectMessageList'

const style = {
  // position: 'absolute' as const,
  // bottom: '-10%',
  // right: '-10%',
  // transform: 'translate(-50px, -50px)',
  width: '600px',
  maxWidth: '80vw',
  height: '500px',
  maxHeight: '50vh',
  border: '1px solid #000',
  bgcolor: 'grey.200',
  // boxShadow: 24,
  p: 4,
};

interface User {
  name: string;
  lastMessageDate: number; 
}

export default function DirectMessage(): JSX.Element {
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

    const user: User[] = [
      { name: 'hola1', lastMessageDate: 2},
      { name: 'hola2', lastMessageDate: 1},
      { name: 'hola3', lastMessageDate: 3 },
      { name: 'hola4', lastMessageDate: 5 },
      { name: 'hola5', lastMessageDate: 6 },
      { name: 'hola6', lastMessageDate: 7 },
      { name: 'hola7', lastMessageDate: 4 },
      { name: 'hola8', lastMessageDate: 8 },
      { name: 'hola9', lastMessageDate: 9 },
      { name: 'hola10', lastMessageDate: 10 },
      { name: 'hola11', lastMessageDate: 11 },
      { name: 'hola12', lastMessageDate: 12 },
      { name: 'hola13', lastMessageDate: 13 },
      { name: 'hola14', lastMessageDate: 14 }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);


  return (
    <Box>
      <Fab onClick={handleButtonClick('top-end')} size="medium" sx={{ position: 'absolute' as const,
 margin: '20px',  boxShadow: 0, bottom: '0%',  right: '0%',}}>
        <Send />
      </Fab>
      <Popper open={open} anchorEl={anchorEl} placement={placement} >
              <Box sx={style} style={{outline: 'none', padding: '0'}}>
                  {/* <IconButton onClick={handleButtonClick('top-end')} size="small">
                      <CloseIcon />
                  </IconButton> */}
                  {/* Text in a popperText in a popperText in a popperText in a popper */}
                  <List 
                  sx={{position: 'absolute' as const, overflowX:'hidden', width:'30%', maxWidth:'300px', maxHeight:'100%', height:'100%', border: '1px solid #000',}}>
                    {user.map((user) =>
                          <Box>
                            <DirectMessageList {...{selectedIndex, setSelectedIndex}} nickname={user.name} lastMessageDate={user.lastMessageDate} />
                            <Divider light />
                          </Box>
                      )}
                    </List>
                  <Box sx={{position: 'absolute' as const, width:'70%', right:'0%', height: '100%', border: '1px solid #000'}} />
                <Divider orientation='vertical'/>
              </Box>
      </Popper>

        </Box>
    )
}