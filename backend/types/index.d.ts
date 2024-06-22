import { Socket } from "socket.io";

export type GameId = string;
export type PlayerId = string;
export type PlayerName = string;
export type GameState = "waiting" | "playing" | "finished";

type EditableKeys = "wpm" | "accuracy";
type EditableFields = {
  [key in EditableKeys]?: string;
};

interface Game {
  state: GameState;
  winner: PlayerId;
  amountPlayers: number;
}

interface Player {
  id: PlayerId;
  name: PlayerName | undefined;
  wpm: string | undefined;
  accuracy: string | undefined;
}

export interface GameSocket extends Socket {
  gameID?: string;
  playerID?: string;
}
