import { useEffect, useState } from 'react';
import { WinnerResults } from '@/types';
import io, { Socket } from 'socket.io-client';
import { socketEvents } from '../constants/constants.ts';
import usePlayersGame from '@/hooks/usePlayersGame.tsx';
import { createSession, getSession, removeSession } from '@/utils/session.ts';
type UseGameConnection = {
  username: string | undefined;
  gameID: string;
};
const SOCKET_IO_URL = 'http://localhost:3000';

export default function useGameConnection({ username, gameID }: UseGameConnection) {
  const { game, setGame, updatePlayer, setPlayers } = usePlayersGame();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_IO_URL);
    setSocket(socketInstance);

    socketInstance.on(socketEvents.WELCOME, ({ player, players }) => {
      setGame((prevGame) => ({
        ...prevGame,
        user: player.id,
        players: players,
      }));

      const info = {
        playerId: player.id as string,
        gameId: gameID,
        username: username,
      };

      createSession(info);
    });

    socketInstance.on(socketEvents.UPDATE, ({ type, player, players }) => {
      console.log('recevied: UPDATE', type, player, players);
      if (!type) return;

      if (type === 'updatePlayer') {
        updatePlayer(player);
      } else if (type === 'newPlayers' && players) {
        setPlayers(players);
      }
    });

    let cookieObj = getSession();
    if (username || cookieObj) {
      let playerId = null;
      let gameToConnect = gameID;

      if (cookieObj) {
        if (cookieObj?.playerId) playerId = cookieObj?.playerId;
        if (cookieObj?.gameId) gameToConnect = cookieObj?.gameId;
      }

      socketInstance.emit(socketEvents.JOIN, username, gameToConnect, playerId);
    }

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const finishGame = (results: WinnerResults | null) => {
    if (!socket) return;
    removeSession();
    if (results) {
      socket.emit(socketEvents.FINISH, results);
    }
  };

  const joinGame = (username: string) => {
    if (!socket) return;
    socket.emit(socketEvents.JOIN, username, gameID);
  };

  return {
    game,
    joinGame,
    finishGame,
    socket,
  };
}
