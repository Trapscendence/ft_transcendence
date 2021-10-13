import { useState } from 'react';
import { useHistory } from 'react-router';

import Navigation from './Navigation';

function NavigationContainer(): JSX.Element {
  const [tabValue, setTabValue] = useState(0);
  const history = useHistory();
  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    const path: string | null = e.currentTarget.getAttribute('aria-label');
    history.push('/' + (path as string));
    setTabValue(newValue);
  }; // @mui/lab 에서 제공하는 페이지 이동 api가 있음. 어느게 성능이 더 좋을지 모르겠다. https://mui.com/components/tabs/#experimental-api 참고

  return <Navigation {...{ tabValue, handleChange }} />;
}

export default NavigationContainer;
