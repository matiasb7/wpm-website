import { endpoints } from '@/constants/constants.ts';
import { languagesType } from '@/types';
import { removeSession } from '@/utils/session.ts';

export async function startGame(amount: string | number) {
  const response = await fetch(endpoints.START_GAME, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amountPlayers: amount }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      error: true,
      status: response.status,
      errorMessage: errorText,
    };
  }
  removeSession();
  const { gameId } = await response.json();
  return { gameId };
}

export async function getGame(gameId: string) {
  const response = await fetch(`${endpoints.GAME}/${gameId}`);
  return await response.json();
}

export async function getText({ lang }: { lang: languagesType }) {
  const response = await fetch(`${endpoints.PHRASE}?lang=${lang}`);
  if (!response.ok) {
    const errorText = await response.text();
    return {
      error: true,
      status: response.status,
      errorMessage: errorText,
    };
  }
  return await response.json();
}
