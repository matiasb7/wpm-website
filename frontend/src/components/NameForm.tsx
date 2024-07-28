import React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface NameForm {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
export default function NameForm({ onSubmit }: NameForm) {
  return (
    <form onSubmit={onSubmit} className='flex gap-5 justify-center items-center'>
      <input
        className='h-input'
        autoFocus={true}
        type='text'
        name='username'
        placeholder='Enter your name'
      />
      <Button type='submit' variant='outline' size='icon'>
        <ChevronRightIcon className='h-4 w-4 text-black' />
      </Button>
    </form>
  );
}
