import { endpoints } from '@/constants/constants.ts';

export async function startGame(amount: string | number) {
  const response = await fetch(endpoints.START_GAME, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amountPlayers: amount }),
  });
  const { gameId } = await response.json();
  return { gameId };
}

export async function getGame(gameId: string) {
  const response = await fetch(`${endpoints.GAME}/${gameId}`);
  return await response.json();
}
