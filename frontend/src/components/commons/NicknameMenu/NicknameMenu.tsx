import { useMutation, useQuery } from '@apollo/client';
import { Menu, MenuItem, MenuList } from '@mui/material';
import gql from 'graphql-tag';
import { useHistory } from 'react-router';

import { userIdVar } from '../../..';
import {
  ADD_TO_BLACKLIST,
  DELETE_FROM_BLACKLIST,
  GET_MY_BLACKLIST,
} from '../../../utils/Apollo/gqls';
import {
  AddToBlackListResponse,
  DeleteFromBlackListResponse,
  GetMyBlacklistResponse,
} from '../../../utils/Apollo/responseModels';
import handleError from '../../../utils/handleError';
import ErrorAlert from '../ErrorAlert';
import ChannelNicknameMenu from './ChannelNicknameMenu';

interface NicknameMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  channelId?: string;
  id: string;
}

export default function NicknameMenu({
  anchorEl,
  open,
  handleClose,
  channelId,
  id,
}: NicknameMenuProps): JSX.Element {
  const { data: blacklistData, error: blacklistError } =
    useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST);

  const [addToBlackList, { error: AddError }] =
    useMutation<AddToBlackListResponse>(ADD_TO_BLACKLIST, {
      variables: { black_id: id },
      refetchQueries: [GET_MY_BLACKLIST],
    });

  const [deleteFromBlackList, { error: deleteError }] =
    useMutation<DeleteFromBlackListResponse>(DELETE_FROM_BLACKLIST, {
      variables: { black_id: id },
      refetchQueries: [GET_MY_BLACKLIST],
    });

  const errorVar = blacklistError || AddError || deleteError;

  const { data: gameIdData } = useQuery<{
    user: { id: string; game: { id: string } };
  }>(
    gql`
      query GetGameId($id: ID!) {
        user(id: $id) {
          id
          game {
            id
          }
        }
      }
    `,
    { variables: { id } }
  );

  const history = useHistory();

  const onClickObserve = () => {
    if (gameIdData?.user?.game?.id)
      history.push('/observe', { game_id: gameIdData.user.game.id });
  };

  if (id === userIdVar()) return <></>;

  return (
    <>
      {errorVar && <ErrorAlert name="NicknameMenu" error={errorVar} />}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuList autoFocusItem={open}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>DM</MenuItem>
          {gameIdData?.user?.game?.id && (
            <MenuItem onClick={onClickObserve}>Observe the match</MenuItem>
          )}
          <MenuItem>Ask a match</MenuItem>
          {blacklistData &&
          blacklistData.user &&
          blacklistData.user.blacklist.find((black) => black.id === id) ? (
            <MenuItem onClick={() => handleError(deleteFromBlackList)}>
              Delete from blacklist
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleError(addToBlackList)}>
              Add to blacklist
            </MenuItem>
          )}
          {channelId && <ChannelNicknameMenu {...{ channelId, id }} />}
        </MenuList>
      </Menu>
    </>
  );
}
