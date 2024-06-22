import { getCookie, removeCookie, setCookie } from './cookie.js';
import { cookies } from '../constants/constants.js';
import { gameStatus } from '@/types';
import { gameStatus as GAME_STATUS } from '../constants/constants.ts';

const COOKIE_NAME = cookies.SESSION;

type Session = {
  playerId: string;
  gameId: string;
  username: string;
  gameStatus: gameStatus;
};

export function createSession({ playerId, gameId, username }: Partial<Session>) {
  setCookie(
    COOKIE_NAME,
    JSON.stringify({ playerId, gameId, username, gameStatus: GAME_STATUS.WAITING }),
    { expires: 1 / 48 },
  );
  return true;
}

export function getSession() {
  const session = getCookie(COOKIE_NAME);
  if (session) return JSON.parse(session);
  return false;
}

export function updateSession(data: Partial<Session>) {
  const session = getSession();
  if (!session) return false;

  const newSession = { ...session };
  Object.keys(data).forEach((key) => {
    if (key in session) {
      newSession[key as keyof Session] = data[key as keyof Session];
    }
  });
  createSession(newSession);
  return true;
}

export function removeSession() {
  removeCookie(COOKIE_NAME);
  return true;
}
