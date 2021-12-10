import { useQuery } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import { userIdVar } from '.';
import AppRouters from './AppRouters';
import LoadingBackdrop from './components/commons/LoadingBackdrop';
import { GET_MY_ID } from './utils/Apollo/gqls';
import { GetMyIdResponse } from './utils/Apollo/responseModels';

function App(): JSX.Element {
  const { loading, data, error } = useQuery<GetMyIdResponse>(GET_MY_ID);

  if (loading) return <LoadingBackdrop loading={loading} />;
  if (error) console.log(error);
  if (data) userIdVar(data.user?.id);

  return (
    <BrowserRouter>
      <AppRouters />
    </BrowserRouter>
  );
}

export default App;
