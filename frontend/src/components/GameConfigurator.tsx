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
import { useToast } from '@/components/ui/use-toast.ts';

function GameConfigurator({
  buttonClass,
  buttonText,
}: {
  buttonClass?: string;
  buttonText: string;
}) {
  let navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const amount = form.elements.namedItem('amount') as HTMLInputElement;
    const name = form.elements.namedItem('username') as HTMLInputElement;

    try {
      const startGameResponse = await startGame(amount.value);
      if (startGameResponse?.error) {
        toast({
          variant: 'destructive',
          description:
            startGameResponse?.errorMessage || 'There was an error, please try again later.',
        });
      }

      if (startGameResponse?.gameId) {
        const encodedUserName = encodeURIComponent(name.value);
        navigate(`/game/${startGameResponse.gameId}?username=${encodedUserName}`);
      }
    } catch (error) {
      toast({
        description: 'There was an error, please try again later.',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={buttonClass} variant='secondary'>
          {buttonText}
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
                min='2'
                max='10'
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
              <Input
                required
                id='username'
                name='name'
                defaultValue='Matias'
                maxLength={32}
                className='col-span-3'
              />
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
