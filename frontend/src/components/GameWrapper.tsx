import useGetText from '../hooks/useGetText.tsx';
import { type ScoreWPM } from '@/types';
import Game from '../components/Game.tsx';
import React, { useEffect } from 'react';
import NameForm from '../components/NameForm.tsx';
import Players from '../components/Players.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import useGameConnection from '@/hooks/useGameConnection.tsx';
import confetti from 'canvas-confetti';
import { buttonVariants } from '@/components/ui/button';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { gameStatus as GAME_STATUS } from '../constants/constants.ts';
import { removeSession, updateSession } from '@/utils/session.ts';
import CopyButton from '@/components/CopyButton.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import AnimatedCountdown from '@/components/AnimatedCountdown.tsx';
import { languages } from '@/constants/languages.ts';

function GameWrapper({ gameID, username }: { gameID: string; username: string | undefined }) {
  const location = useLocation();
  const { socket, game, finishGame, joinGame, setGameStatus, quitGame } = useGameConnection({
    username,
    gameID,
  });
  const { phraseArray } = useGetText(languages.en, game.phrase || '');
  const userId = game?.user;
  const navigate = useNavigate();
  const { toast } = useToast();
  const gameStatus = game.status;
  const isLoadingGame = game.firstLoad;

  useEffect(() => {
    updateSession({ gameStatus });
  }, [gameStatus]);

  const onFinish = ({ wpm, timeStamp, accuracy }: ScoreWPM) => {
    if (!socket) return;
    finishGame({ wpm, timeStamp, accuracy, winnerId: userId || undefined });
    void confetti({ particleCount: 300, spread: 300 });
    setGameStatus(GAME_STATUS.FINISHED);
  };

  const beforeStart = () => {
    if (game.status !== GAME_STATUS.PLAYING) {
      toast({
        className: 'bg-green-300',
        description: 'Wait for all player to start the game...',
      });
      return false;
    }
    return gameStatus !== GAME_STATUS.READY_TO_PLAY;
  };

  const onStart = () => {
    setGameStatus(GAME_STATUS.PLAYING);
  };

  const enterName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    joinGame(event.target.elements.username.value);
  };

  const handleCountDownComplete = () => {
    if (gameStatus !== GAME_STATUS.FINISHED) {
      setGameStatus(GAME_STATUS.FINISHED);
      finishGame(null);
    }
  };

  const quitTheGame = () => {
    removeSession();
    quitGame();
    navigate('/');
  };

  return (
    <>
      <div
        className={`flex justify-center relative ${gameStatus === GAME_STATUS.FINISHED || !userId ? '' : 'mb-14'}`}
      >
        <AnimatedCountdown
          startNumber={3}
          startPlaying={gameStatus === GAME_STATUS.READY_TO_PLAY}
          startText='Starting in...'
          onFinish={() => setGameStatus(GAME_STATUS.PLAYING)}
        />
        <h2 className='text-2xl mb-14'>See how fast you can type!</h2>
        {userId && gameStatus !== GAME_STATUS.FINISHED && (
          <div className='text-4xl absolute right-0 top-[-100px] fromRight'>
            <CountdownCircleTimer
              onComplete={handleCountDownComplete}
              isPlaying={gameStatus === GAME_STATUS.PLAYING}
              duration={60}
              colors={['#50C878', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[45, 30, 15, 0]}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>
        )}
      </div>
      {!isLoadingGame && !userId && (
        <div>
          <NameForm onSubmit={enterName} />
          <a href='/' className={buttonVariants({ variant: 'secondary' }) + ' mt-10'}>
            Back to Homepage
          </a>
        </div>
      )}
      {userId && (
        <section className='fadeIn'>
          {gameStatus !== GAME_STATUS.FINISHED && (
            <Game
              phraseArray={phraseArray}
              onFinish={onFinish}
              onStart={onStart}
              beforeStart={beforeStart}
            />
          )}
          {gameStatus === GAME_STATUS.FINISHED && (
            <a href='/' className={buttonVariants({ variant: 'secondary' })}>
              Back to Homepage
            </a>
          )}
          {game.players.length > 0 && <Players players={game.players} />}
          {gameStatus === GAME_STATUS.WAITING && (
            <div className='flex gap-4 mx-auto mt-10 justify-center items-center w-fit'>
              Invite your friends to join the game
              <CopyButton
                initialText={'Copy link'}
                copiedText={'Copied!'}
                link={`${window.location.origin}${location.pathname}`}
              />
            </div>
          )}

          {gameStatus !== GAME_STATUS.FINISHED && (
            <Button onClick={quitTheGame} variant='destructive' className='w-fit mx-auto mt-7'>
              Quit Game
            </Button>
          )}
        </section>
      )}
    </>
  );
}

export default GameWrapper;
