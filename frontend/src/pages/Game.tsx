import { useParams, useSearchParams } from 'react-router-dom';
import GameWrapper from '@/components/GameWrapper.tsx';
import useValidGameId from '@/hooks/useValidGameId.tsx';
import useGetSession from '@/hooks/useGetSession.tsx';
import Loader from '@/components/Loader.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';

function GamePage() {
  const { getSession } = useGetSession();
  const params = useParams();
  let gameId = params.id;
  const [searchParams] = useSearchParams();
  let username = searchParams.get('username') || undefined;

  const session = getSession();

  if (session) {
    if (session?.gameId) {
      gameId = session.gameId;
      history.pushState(null, '', `/game/${gameId}`);
    }
    if (session?.username) username = session?.username;
  }

  const { isValidId } = useValidGameId(gameId);

  return (
    <main className='p-[2rem]'>
      <Toaster />
      <h1 className='text-5xl font-bold mb-7'>Typing Race</h1>
      {isValidId && gameId && <GameWrapper gameID={gameId} username={username} />}
      {isValidId === 'loading' && (
        <Loader className='justify-center flex w-full' isLoading={true} />
      )}
      {!isValidId && (
        <h2 className='text-3xl font-semibold border rounded py-3 px-3 mx-auto w-fit border-red-700 text-red-700'>
          Invalid game ID
        </h2>
      )}
    </main>
  );
}

export default GamePage;
