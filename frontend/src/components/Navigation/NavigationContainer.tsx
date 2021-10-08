import { useState } from 'react';
import { useHistory } from 'react-router';
import Navigation from './Navigation';

function NavigationContainer(): JSX.Element {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    // console.log(e.target);
    const example: string | null = e.currentTarget.getAttribute('aria-label');

    history.push('/' + (example as string));
    setTabValue(newValue);
  };
  const history = useHistory();
  // const onClickGame = () => history.push('/game');
  // const onClickChat = () => history.push('/chat');
  // const onClickDM = () => history.push('/dm');

  return (
    <Navigation
      // {...{ tabValue, handleChange, onClickGame, onClickChat, onClickDM }}
      {...{ tabValue, handleChange }}
    />
  );
}

export default NavigationContainer;

/*
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function NavigationContainer() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: '100vh',
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="INDEX" {...a11yProps(0)} />
        <Tab label="LOGIN" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </Box>
  );
}

export default NavigationContainer;
*/
