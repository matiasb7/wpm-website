export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const gameStatus = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
  READY_TO_PLAY: 'readyToPlay',
  START_PLAYING: 'startPlaying',
};

export const endpoints = {
  GAME: API_URL + '/game',
  CREATE_GAME: API_URL + '/game/create',
  START_GAME: API_URL + '/game/start',
  PHRASE: API_URL + '/game/phrase',
};

export const socketEvents = {
  FINISH: 'finish',
  QUIT: 'quit',
  JOIN: 'join',
  NEW_PLAYER: 'newPlayer',
  PLAYER_ADDED: 'playerAdded',
  WELCOME: 'welcome',
  UPDATE: 'update',
  START_GAME: 'startGame',
  ERROR: 'error',
  READY_TO_PLAY: 'readyToPlay',
};

export const cookies = {
  USER_ID: 'userId',
  SESSION: 'session',
};
