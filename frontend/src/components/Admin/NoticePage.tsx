import { useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Paper,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { Notice, NoticeData, NoticeVars } from '../../utils/Apollo/Home';
import { GET_NOTICES } from '../../utils/Apollo/HomeQuery';

function NoticePage(): JSX.Element {
  const { data } = useQuery<NoticeData, NoticeVars>(GET_NOTICES, {
    variables: {
      offset: 0,
      limit: 100,
    },
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },

    {
      field: 'title',
      headerName: 'title',
      width: 100,
    },
    {
      field: 'contents',
      headerName: 'content',
      width: 200,
    },
    {
      field: 'nickname',
      headerName: 'writer',
      width: 100,
    },
    {
      field: 'time_stamp',
      headerName: 'Tme',
      type: 'number',
      width: 110,
    },
  ];
  const [rows, setRows] = useState<
    {
      nickname: string;
      title: string;
      contents: string;
      time_stamp: string;
      id: number;
    }[]
  >([
    {
      id: 0,
      nickname: '',
      title: '',
      contents: '',
      time_stamp: '',
    },
  ]);
  useEffect(() => {
    if (data)
      setRows(
        data.Notices.map((notice, index) => {
          return {
            id: index,
            nickname: notice.writer.nickname,
            title: notice.title,
            contents: notice.contents,
            time_stamp: notice.time_stamp,
          };
        })
      );
  }, [data]);

  const handleClick = (params: GridCellParams) => {
    console.log(params.row);
  };
  //TODO 권한 없을경우 권한이 없습니다. 띄우게하기
  return (
    <div style={{ height: '90%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[5]}
        onCellClick={(params) => handleClick(params)}
        disableSelectionOnClick
      />
    </div>
  );
}
export default NoticePage;
