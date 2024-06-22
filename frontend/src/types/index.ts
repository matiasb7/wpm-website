import { type languages } from '../constants/languages';
import { gameStatus } from '../constants/constants.ts';

export type languagesType = (typeof languages)[keyof typeof languages];
export type gameStatus = (typeof gameStatus)[keyof typeof gameStatus];

export interface timeInterface {
  start: number | null;
  end: number | null;
}

export interface ScoreWPM {
  wpm: string;
  accuracy: number;
  timeStamp: number;
}

export interface WinnerResults extends ScoreWPM {
  winnerId: string | undefined; // Extending ScoreWPM to include winnerId
}

export interface Player {
  name: string;
  id: string | null;
  wpm: number;
  accuracy: number;
}

export interface Game {
  status: gameStatus;
  winner: string;
  players: Player[];
  user: string | null;
}

export interface ScoreWPMInterface extends Array<ScoreWPM> {}
