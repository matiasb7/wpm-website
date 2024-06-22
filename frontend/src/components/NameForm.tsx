import React from 'react';

interface NameForm {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
export default function NameForm({ onSubmit }: NameForm) {
  return (
    <form onSubmit={onSubmit}>
      <input
        className='h-input'
        autoFocus={true}
        type='text'
        name='username'
        placeholder='Enter your name'
      />
    </form>
  );
}
