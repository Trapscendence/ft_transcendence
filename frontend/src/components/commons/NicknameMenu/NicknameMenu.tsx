import { useMutation, useQuery } from '@apollo/client';
import { Menu, MenuItem, MenuList } from '@mui/material';
import gql from 'graphql-tag';
import { useState } from 'react';
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
import { UserStatus } from '../../../utils/Apollo/schemaEnums';
import handleError from '../../../utils/handleError';
import ErrorAlert from '../ErrorAlert';
import ChannelNicknameMenu from './ChannelNicknameMenu';
import CustomGameModal from './CustomGameModal';

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
  const [gameModal, setGameModal] = useState(false);

  const { data: blacklistData, error: blacklistError } =
    useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST);

  const {
    data: friendsData,
    loading: friendsLoading,
    error: friendsError,
  } = useQuery<{
    user: {
      id: string;
      friends: {
        id: string;
        nickname: string;
        status: UserStatus;
        // avatar: string;
        status_message?: string;
      }[];
    };
  }>(gql`
    query GetMyFriends {
      user {
        id
        friends {
          id
          nickname
          status
          # avatar // NOTE: 아직 에러...
          status_message
        }
      }
    }
  `);

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

  const [addFriend, { loading: addFriendLoading, error: addFriendError }] =
    useMutation<{ addFriend: boolean }>(
      gql`
        mutation AddFriend($friend_id: ID!) {
          addFriend(friend_id: $friend_id)
        }
      `,
      { variables: { friend_id: id }, refetchQueries: ['GetMyFriends'] }
    );

  const [
    deleteFriend,
    { loading: deleteFriendLoading, error: deleteFriendError },
  ] = useMutation<{ deleteFriend: boolean }>(
    gql`
      mutation DeleteFriend($friend_id: ID!) {
        deleteFriend(friend_id: $friend_id)
      }
    `,
    { variables: { friend_id: id }, refetchQueries: ['GetMyFriends'] }
  );

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

          {gameIdData && gameIdData.user?.game?.id ? (
            <MenuItem onClick={onClickObserve}>Observe the game</MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                setGameModal(true);
              }}
            >
              Ask a custom game
            </MenuItem>
          )}

          {gameModal && (
            <CustomGameModal id={id} open={gameModal} setOpen={setGameModal} />
          )}

          {blacklistData &&
          blacklistData.user?.blacklist.find((black) => black.id === id) ? (
            <MenuItem onClick={() => handleError(deleteFromBlackList)}>
              Delete from blacklist
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleError(addToBlackList)}>
              Add to blacklist
            </MenuItem>
          )}

          {friendsData &&
          friendsData.user?.friends?.find((val) => val.id === id) ? (
            <MenuItem onClick={() => handleError(deleteFriend)}>
              Delete from friend
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleError(addFriend)}>
              Add to friend
            </MenuItem>
          )}

          {channelId && <ChannelNicknameMenu {...{ channelId, id }} />}
        </MenuList>
      </Menu>
    </>
  );
}
