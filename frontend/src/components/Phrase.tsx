interface PhraseProps {
  phraseArray: string[];
  currentKeyIndex: number;
}
export default function Phrase({ phraseArray, currentKeyIndex }: PhraseProps) {
  return (
    <ul className='mb-10 border-b-2 pb-4'>
      {phraseArray.map((letter, index) => {
        const keyClass =
          index === currentKeyIndex
            ? 'bg-gray-500'
            : index < currentKeyIndex
              ? 'text-gray-500'
              : '';
        return (
          <li
            key={index}
            className={`md:text-2xl lg:text-3xl inline-block h-[32px] min-w-[10px] align-bottom ${keyClass}`}
          >
            {letter}
          </li>
        );
      })}
    </ul>
  );
}
