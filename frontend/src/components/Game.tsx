import { useHandleKey } from '../hooks/useHandleKey.tsx';
import Phrase from './Phrase.tsx';
import KeyboardWrapper from './keyboard.tsx';
import { type ScoreWPM } from '@/types';

interface GameProps {
  phraseArray: string[];
  onFinish: (props: ScoreWPM) => void;
  onStart?: () => void | undefined;
  beforeStart?: () => boolean;
}
export default function Game({ phraseArray, onFinish, onStart, beforeStart }: GameProps) {
  const { inputKey, onKeyPress, currentKeyIndex } = useHandleKey({
    phraseArray,
    onFinish,
    onStart,
    beforeStart,
  });
  return (
    <div className='w-full'>
      <Phrase phraseArray={phraseArray} currentKeyIndex={currentKeyIndex} />
      <h2 className='text-2xl md:hidden w-full h-input'>
        Open the site on desktop to test your skills!
      </h2>
      <KeyboardWrapper
        nextKey={phraseArray[currentKeyIndex]}
        inputKey={inputKey}
        onKeyPress={onKeyPress}
        modifierClass='hidden md:block'
      />
    </div>
  );
}
