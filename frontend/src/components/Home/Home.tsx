/* eslint-disable */
// import { Redirect } from 'react-router';

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Box, Button, Divider } from '@mui/material';

import { NoticeData, NoticeVars } from '../../utils/Apollo/Home';
import { GET_NOTICES } from '../../utils/Apollo/HomeQuery';
import GameEndModal from '../Game/GameEndModal';

function Home(): JSX.Element {
  const location = useLocation<{ winner: { nickname: string } }>();

  if (!location.state)
    return (
      <div>
        <Notices />
      </div>
    );

  const { winner } = location.state;

  function Notices(): JSX.Element {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    //NOTE offset이 바뀌어서 usequery가 실행되는거고... useQuery는 원래 한번만 실행된다...(헐...)
    const { data } = useQuery<NoticeData, NoticeVars>(GET_NOTICES, {
      variables: {
        offset: offset,
        limit: limit,
      },
    });
    const handleClick = () => {
      setOffset(0);
      setLimit(limit + 1);
      console.log(offset, limit);
    };
    console.log(data);
    return (
      <div>
        <Button
          onClick={() => handleClick()}
          variant="contained"
          sx={{
            boxShadow: 0,
            margin: '5px 0px 5px 8px',
          }}
        />
      </div>
    );
  }

  return (
    <>
      {winner && <GameEndModal open={!!winner} winner={winner.nickname} />}
      <Notices />
    </>
  );
}

export default Home;
