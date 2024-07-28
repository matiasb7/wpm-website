import { useEffect, useRef, useState } from 'react';
import { type timeInterface, type ScoreWPM } from '@/types';
import calcScore from '../utils/calcScore.tsx';
interface useKeywordEntryParams {
  phraseArray: string[];
  onFinish: (props: ScoreWPM) => void;
  onStart?: () => void | undefined;
  beforeStart?: () => boolean;
}

export function useHandleKey({
  phraseArray,
  onFinish,
  onStart,
  beforeStart,
}: useKeywordEntryParams) {
  const [inputKey, setInputKey] = useState<string>('');
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const time = useRef<timeInterface>({ start: null, end: null });
  const inputErrors = useRef<number>(0);
  const textLength = phraseArray.length;
  const firstKey = useRef(true);

  const onKeyPress = (button: string) => {
    setInputKey(button); // Highlight the button on virtual keyboard press
  };

  const finishPhrase = () => {
    const endTime = Date.now();
    if (time.current.start == null) return;
    const { wpmScore } = calcScore(time.current.start, endTime, textLength);
    const accuracyScore = textLength / inputErrors.current;
    onFinish({ wpm: wpmScore, timeStamp: endTime, accuracy: accuracyScore });
  };

  const reset = () => {
    setCurrentKeyIndex(0);
    setInputKey('');
    time.current = { start: null, end: null };
  };

  useEffect(() => {
    reset();
  }, [phraseArray]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (firstKey.current) {
        if (beforeStart) {
          const canStart = beforeStart();
          if (!canStart) return;
        }
        firstKey.current = false;
        time.current = { start: Date.now(), end: null };
        if (onStart) onStart();
      }

      const key = event.key === ' ' ? '{space}' : event.key.toLowerCase();
      setInputKey(key);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [beforeStart]);

  useEffect(() => {
    const correctKey =
      phraseArray[currentKeyIndex] === ' ' ? '{space}' : phraseArray[currentKeyIndex];

    if (inputKey === correctKey) {
      if (currentKeyIndex === textLength - 1) {
        finishPhrase();
        inputErrors.current = 0;
      } else {
        setCurrentKeyIndex(currentKeyIndex + 1);
        setInputKey('');
      }
    } else {
      inputErrors.current += 1;
    }
  }, [inputKey]);

  return { inputKey, onKeyPress, currentKeyIndex };
}
