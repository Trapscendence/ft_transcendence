import { Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';

export default function SocialDrawer(): JSX.Element {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (openBool: boolean) => () => {
    setOpen(openBool);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Button onClick={toggleDrawer(true)} sx={{ height: '100px' }}>
        open
      </Button>
      {/* <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}> */}
      <Drawer variant="persistent" anchor="right" open={open}>
        <Button onClick={toggleDrawer(false)}>close</Button>
        <Box>
          <List>
            <ListItem>
              <ListItemText primary="안녕하세요?" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
