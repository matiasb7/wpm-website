import useGetText from '../hooks/useGetText.tsx';
import { type ScoreWPM } from '@/types';
import Game from '../components/Game.tsx';
import React, { useEffect, useState } from 'react';
import NameForm from '../components/NameForm.tsx';
import Players from '../components/Players.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useLocation } from 'react-router-dom';
import useGameConnection from '@/hooks/useGameConnection.tsx';
import confetti from 'canvas-confetti';
import { buttonVariants } from '@/components/ui/button';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { type gameStatus as gameStatusTypes } from '@/types';
import { gameStatus as GAME_STATUS } from '../constants/constants.ts';
import { updateSession } from '@/utils/session.ts';

function GameWrapper({ gameID, username }: { gameID: string; username: string | undefined }) {
  const { phraseArray } = useGetText();
  const [buttonCopyText, setButtonCopyText] = useState('Copy Link');
  const [gameStatus, setGameStatus] = useState<gameStatusTypes>(GAME_STATUS.WAITING);
  const location = useLocation();
  const { socket, game, finishGame, joinGame } = useGameConnection({ username, gameID });
  const userId = game?.user;

  useEffect(() => {
    const hasFinished = Boolean(game.players.find((p) => p.id === userId)?.wpm);
    if (hasFinished) {
      setGameStatus(GAME_STATUS.FINISHED);
    }
  }, [game]);

  useEffect(() => {
    updateSession({ gameStatus });
  }, [gameStatus]);

  const onFinish = ({ wpm, timeStamp, accuracy }: ScoreWPM) => {
    if (!socket) return;
    finishGame({ wpm, timeStamp, accuracy, winnerId: userId || undefined });
    void confetti({ particleCount: 300, spread: 300 });
    setGameStatus(GAME_STATUS.FINISHED);
  };

  const onStart = () => setGameStatus(GAME_STATUS.PLAYING);

  const enterName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    joinGame(event.target.elements.username.value);
  };

  const copyUrlButton = () => {
    const urlWithoutParams = `${window.location.origin}${location.pathname}`;
    navigator.clipboard.writeText(urlWithoutParams).then(() => {
      setButtonCopyText('Copied!');
      setTimeout(() => {
        setButtonCopyText('Copy Link');
      }, 3000);
    });
  };

  const handleCountDownComplete = () => {
    if (gameStatus !== GAME_STATUS.FINISHED) {
      setGameStatus(GAME_STATUS.FINISHED);
      finishGame(null);
    }
  };

  return (
    <>
      <div
        className={`flex justify-center relative ${gameStatus === GAME_STATUS.FINISHED || !userId ? '' : 'mb-14'}`}
      >
        <h2 className='text-2xl mb-14'>See how fast you can type!</h2>
        {userId && gameStatus !== GAME_STATUS.FINISHED && (
          <div className='text-4xl absolute right-0 top-[-100px]'>
            <CountdownCircleTimer
              onComplete={handleCountDownComplete}
              isPlaying={gameStatus === 'playing'}
              duration={60}
              colors={['#50C878', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[45, 30, 15, 0]}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>
        )}
      </div>
      {!userId && <NameForm onSubmit={enterName} />}
      {userId && (
        <section>
          {gameStatus !== GAME_STATUS.FINISHED && (
            <Game phraseArray={phraseArray} onFinish={onFinish} onStart={onStart} />
          )}
          {gameStatus === GAME_STATUS.FINISHED && (
            <a href='/' className={buttonVariants({ variant: 'secondary' })}>
              Back to Homepage
            </a>
          )}
          {game.players.length > 0 && <Players players={game.players} />}
          <div className='flex gap-4 mx-auto mt-10 justify-center items-center w-fit'>
            Invite your friends to join the game
            <Button onClick={copyUrlButton} variant='secondary' className='w-fit mx-auto'>
              {buttonCopyText}
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

export default GameWrapper;
