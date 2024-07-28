import { useState } from 'react';
import { Game as GameInterFace, Player } from '../types/index.js';
import { gameStatus } from '@/constants/constants.ts';

export default function usePlayersGame() {
  const [game, setGame] = useState<GameInterFace>({
    status: gameStatus.WAITING,
    winner: '',
    players: [],
    user: null,
    phrase: '',
    firstLoad: true,
  });

  const updateGame = (props: object) => {
    setGame((prevGame) => {
      return {
        ...prevGame,
        ...props,
      };
    });
  };

  const setPlayers = (players: Player[]) => {
    setGame((prevGame) => {
      return {
        ...prevGame,
        players: players,
      };
    });
  };

  const addPlayer = (player: Player) => {
    setGame((prevGame) => {
      return {
        ...prevGame,
        players: [...prevGame.players, player],
      };
    });
  };

  const updatePlayer = (player: Partial<Player>) => {
    setGame((prevGame) => {
      const updatedPlayers = prevGame.players.map((p) => {
        if (p.id === player.id) {
          return { ...p, ...player };
        }
        return p;
      });

      return {
        ...prevGame,
        players: updatedPlayers,
      };
    });
  };

  return { game, setGame, addPlayer, updatePlayer, setPlayers, updateGame };
}
