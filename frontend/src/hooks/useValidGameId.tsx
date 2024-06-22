import { useEffect, useState } from 'react';
import { endpoints } from '@/constants/constants.ts';

export default function useValidGameId(gameId: string | undefined) {
  const [isValidId, setIsValidId] = useState<boolean | 'loading'>('loading');

  useEffect(() => {
    // Function to check if the id is okay
    const validateId = async () => {
      if (!gameId) return setIsValidId(false);

      try {
        const response = await fetch(`${endpoints.GAME}/${gameId}`);
        const data = await response.json();
        setIsValidId(Object.keys(data.game).length > 0);
      } catch (error) {
        setIsValidId(false);
      }
    };

    validateId();
  }, [gameId]);

  return { isValidId };
}
