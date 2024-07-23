import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from '@/services/gameService.ts';

function GameConfigurator() {
  let navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const amount = form.elements.namedItem('amount') as HTMLInputElement;
    const name = form.elements.namedItem('username') as HTMLInputElement;

    try {
      const { gameId } = await startGame(amount.value);
      if (gameId) {
        const encodedUserName = encodeURIComponent(name.value);
        navigate(`/game/${gameId}?username=${encodedUserName}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='text-gray-800 mt-5' variant='outline'>
          Create Game
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Game</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='amount' className='text-right'>
                Players
              </Label>
              <Input
                required
                type='number'
                min='1'
                defaultValue='2'
                id='amount'
                name='amount'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Username
              </Label>
              <Input required id='username' name='name' value='Matias' className='col-span-3' />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Start Game</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GameConfigurator;
