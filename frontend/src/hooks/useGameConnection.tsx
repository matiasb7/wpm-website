import { useEffect, useState } from 'react';
import { Player, Players, WinnerResults, gameStatus as GameStatus, Game } from '@/types';
import io, { Socket } from 'socket.io-client';
import { gameStatus, socketEvents } from '../constants/constants.ts';
import usePlayersGame from '@/hooks/usePlayersGame.tsx';
import { createSession, getSession, removeSession } from '@/utils/session.ts';
import { useToast } from '@/components/ui/use-toast.ts';
type UseGameConnection = {
  username: string | undefined;
  gameID: string;
};
const SOCKET_IO_URL = 'http://localhost:3000';

export default function useGameConnection({ username, gameID }: UseGameConnection) {
  const { game, updatePlayer, setPlayers, updateGame } = usePlayersGame();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  const welcome = ({ player, players, game }: { player: Player; players: Players; game: Game }) => {
    updateGame({
      user: player.id,
      players: players,
      phrase: game.phrase,
    });

    const info = {
      playerId: player.id as string,
      gameId: gameID,
      username: username,
    };
    createSession(info);
  };

  const update = ({
    type,
    player,
    players,
  }: {
    type: string;
    player: Player;
    players: Players;
    game: any;
  }) => {
    if (!type) return;
    if (type === 'updatePlayer') {
      updatePlayer(player);
    } else if (type === 'players' && players) {
      setPlayers(players);
    }
  };

  const startGame = () => {
    updateGame({
      status: gameStatus.READY_TO_PLAY,
    });
  };

  const handleErrors = (error: Error) => {
    console.log(error);
    toast({
      variant: 'destructive',
      description: error?.message || 'There was an error, please try again later.',
    });
  };

  useEffect(() => {
    const socketInstance = io(SOCKET_IO_URL);
    setSocket(socketInstance);

    socketInstance.on(socketEvents.WELCOME, welcome);
    socketInstance.on(socketEvents.UPDATE, update);
    socketInstance.on(socketEvents.READY_TO_PLAY, startGame);
    socketInstance.on(socketEvents.ERROR, handleErrors);

    let cookieObj = getSession();
    if (username || cookieObj) {
      let playerId = null;
      let gameToConnect = gameID;

      if (cookieObj) {
        if (cookieObj?.playerId) playerId = cookieObj?.playerId;
        if (cookieObj?.gameId) gameToConnect = cookieObj?.gameId;
      }

      socketInstance.emit(socketEvents.JOIN, username, gameToConnect, playerId);
    } else {
      updateGame({ firstLoad: false });
    }

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const finishGame = (results: WinnerResults | null) => {
    if (!socket) return;
    removeSession();
    const formatResults = results || { wpm: 0, accuracy: 0, timeStamp: 0 };
    socket.emit(socketEvents.FINISH, formatResults);
  };

  const joinGame = (username: string) => {
    if (!socket) return;
    socket.emit(socketEvents.JOIN, username, gameID);
  };

  const quitGame = () => {
    if (!socket) return;
    socket.emit(socketEvents.QUIT, gameID);
  };

  const setGameStatus = (newStatus: GameStatus) => {
    if (!Object.values(gameStatus).includes(newStatus)) return;
    updateGame({ status: newStatus });
    return true;
  };

  return {
    game,
    joinGame,
    quitGame,
    finishGame,
    socket,
    setGameStatus,
  };
}
