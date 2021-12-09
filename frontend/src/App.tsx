import { useQuery } from '@apollo/client';

import { userIdVar } from '.';
import AppRouter from './AppRouter';
import LoadingBackdrop from './components/commons/LoadingBackdrop';
import { GET_MY_ID } from './utils/Apollo/gqls';
import { GetMyIdResponse } from './utils/Apollo/responseModels';

function App(): JSX.Element {
  const { loading, data, error } = useQuery<GetMyIdResponse>(GET_MY_ID);

  if (error) console.error(error);
  if (loading) return <LoadingBackdrop loading={loading} />;
  if (data) userIdVar(data.user?.id);

  return <AppRouter />;
}

export default App;
