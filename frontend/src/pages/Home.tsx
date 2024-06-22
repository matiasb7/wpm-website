import { type FormEvent, useRef, useState } from 'react';
import useGetText from '../hooks/useGetText.tsx';
import { type languagesType, type ScoreWPMInterface, type ScoreWPM } from '@/types';
import { languages } from '../constants/languages.ts';
import Score from '../components/Score.tsx';
import confetti from 'canvas-confetti';
import Game from '../components/Game.tsx';
import GameConfigurator from '@/components/GameConfigurator.tsx';
import useGetSession from '@/hooks/useGetSession.tsx';
import { buttonVariants } from '@/components/ui/button.tsx';

function Home() {
  const changeTextRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState<languagesType>(languages.en);
  const [WPMScore, setWPMScore] = useState<ScoreWPMInterface>([]);
  const { fetchText, setText, phraseArray } = useGetText(language);
  const { getSession } = useGetSession();
  const session = getSession();

  const onFinish = ({ wpm, timeStamp, accuracy }: ScoreWPM) => {
    setWPMScore(
      (prev: ScoreWPMInterface) => [...prev, { wpm, timeStamp, accuracy }] as ScoreWPMInterface,
    );

    void confetti({ particleCount: 300, spread: 300 });
    fetchText().catch((e) => {
      console.error(e);
    });
  };

  const handleChangeText = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textToChange = changeTextRef.current?.value;
    if (!textToChange) return;
    setText(textToChange);
    changeTextRef.current.value = '';
    changeTextRef.current.blur();
  };

  return (
    <main>
      <h1 className='text-5xl font-bold mb-16'>Typing Test</h1>
      <section>
        <Game phraseArray={phraseArray} onFinish={onFinish} />
        <aside className='hidden md:flex mt-16 min-w-[175px] flex-wrap justify-center items-center gap-10'>
          <div className='flex gap-4 items-center'>
            <span className='block'>Language</span>
            <div>
              <button
                type='button'
                className={`h-btn rounded-l ${language === languages.en ? '!bg-gray-400' : ''}`}
                onClick={() => {
                  setLanguage(languages.en);
                }}
              >
                {languages.en.toUpperCase()}
              </button>
              <button
                type='button'
                className={`h-btn rounded-r ${language === languages.es ? '!bg-gray-400' : ''}`}
                onClick={() => {
                  setLanguage(languages.es);
                }}
              >
                {languages.es.toUpperCase()}
              </button>
            </div>
          </div>
          <form onSubmit={handleChangeText}>
            <input
              ref={changeTextRef}
              type='text'
              className='h-input'
              placeholder='Insert custom text'
            />
            <button className='h-btn rounded ml-2'>Change Text</button>
          </form>
          <div>
            <button type='button' className='h-btn rounded' onClick={fetchText}>
              Random Text
            </button>
          </div>
        </aside>
      </section>
      {!!WPMScore.length && (
        <Score
          modifierClass='hidden md:flex'
          wpm={WPMScore[WPMScore.length - 1]?.wpm}
          accuracy={WPMScore[WPMScore.length - 1]?.accuracy}
        />
      )}
      {!session && <GameConfigurator />}
      {session && (
        <a className={buttonVariants({ variant: 'secondary' }) + ' mt-10'} href='/game/current'>
          Join Current Game
        </a>
      )}
    </main>
  );
}

export default Home;
