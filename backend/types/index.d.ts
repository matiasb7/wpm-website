import { Socket } from "socket.io";

export type GameId = string;
export type PlayerId = string;
export type PlayerName = string;
export type GameState = "waiting" | "playing" | "finished";

export type EditableKeys = "wpm" | "accuracy";
export type EditableFields = {
  [key in EditableKeys]?: string;
};

type GameEditableKeys = "state";
export type GameEditableFields = {
  [key in GameEditableKeys]?: string;
};

interface Game {
  state: GameState;
  winner: PlayerId;
  amountPlayers: number;
  phrase: string;
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
