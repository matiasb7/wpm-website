import { useEffect, useState } from 'react';
import { getGame } from '@/services/gameService.ts';

export default function useValidGameId(gameId: string | undefined) {
  const [isValidId, setIsValidId] = useState<boolean | 'loading'>('loading');

  useEffect(() => {
    // Function to check if the id is okay
    const validateId = async () => {
      if (!gameId) return setIsValidId(false);

      try {
        const data = await getGame(gameId);
        setIsValidId(Object.keys(data.game).length > 0);
      } catch (error) {
        setIsValidId(false);
      }
    };

    validateId();
  }, [gameId]);

  return { isValidId };
}
