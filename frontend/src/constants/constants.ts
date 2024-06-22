export const gameStatus = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

export const API_URL = 'http://localhost:3000';

export const endpoints = {
  GAME: API_URL + '/game',
  CREATE_GAME: API_URL + '/game/create',
  START_GAME: API_URL + '/game/start',
};

export const socketEvents = {
  FINISH: 'finish',
  JOIN: 'join',
  NEW_PLAYER: 'newPlayer',
  PLAYER_ADDED: 'playerAdded',
  WELCOME: 'welcome',
  UPDATE: 'update',
};

export const cookies = {
  USER_ID: 'userId',
  SESSION: 'session',
};
