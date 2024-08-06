import { type FunctionComponent, useEffect, useState } from 'react';
import 'react-simple-keyboard/build/css/index.css';
import confetti from 'canvas-confetti';

interface AnimatedCountdownProps {
  startNumber: number;
  startPlaying: boolean;
  startText?: string;
  onFinish?: () => void;
}

const numberColors: Record<number | string, string> = {
  1: 'text-green-400',
  2: 'text-yellow-300',
  3: 'text-red-400',
  default: 'text-gray-700',
};

const AnimatedCountdown: FunctionComponent<AnimatedCountdownProps> = ({
  startNumber,
  startPlaying,
  startText,
  onFinish,
}) => {
  const [number, setNumber] = useState<number>(startNumber);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (number !== 0 && startPlaying) {
        setNumber((prevNumber) => prevNumber - 1);
      }
    }, 1000);

    if (number === 0 && onFinish) {
      onFinish();
    }

    return () => clearTimeout(timeout);
  }, [number, startPlaying]);

  useEffect(() => {
    if (number === startNumber) return;
    const spread = Math.max(150, 350 / number);
    confetti({ particleCount: 300, spread: spread });
  }, [number]);

  if (number === 0 || !startPlaying) return <></>;
  const color = number in numberColors ? numberColors[number] : numberColors['default'];

  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex justify-center flex-col items-center gap-4 z-50'>
      {startText && number === startNumber && (
        <div className={`font-bold text-5xl ${color}`}>{startText}</div>
      )}
      <div className='relative'>
        <div className='bg-gray-200 rounded-full aspect-square w-40 blur'></div>
        <span
          className={`font-bold text-9xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${color}`}
        >
          {number}
        </span>
      </div>
    </div>
  );
};

export default AnimatedCountdown;
