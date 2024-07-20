import { afterEach, describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent, getByRole, within, cleanup } from '@testing-library/react';
import Home from '../src/pages/Home';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

vi.mock('canvas-confetti', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const HomeRouter = () => {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Home Checks', () => {
  afterEach(cleanup);

  it('Checking start game', () => {
    render(<HomeRouter />);
    const createGameButton = screen.getByText(/Create Game/i);
    fireEvent.click(createGameButton);
    screen.getByRole('dialog');
    screen.getByText(/Start Game/i);
  });

  it('Win Game: Type correct letters', async () => {
    render(<HomeRouter />);
    const list = screen.getByTestId('phrase');
    const listItems = within(list).getAllByRole('listitem', { hidden: true });
    for (const item of listItems) {
      const letter = item.textContent;
      await userEvent.keyboard(letter);
    }
    screen.getByText(/WPM/i);
  });

  it('Do Not Win Game: Type incorrect letters', async () => {
    render(<HomeRouter />);
    const list = screen.getByTestId('phrase');
    const listItems = within(list).getAllByRole('listitem', { hidden: true });
    let wrongLetterToEnter = listItems[0]?.textContent === 'z' ? 'x' : 'z'; // random letter that is not the correct one
    await userEvent.keyboard(wrongLetterToEnter);

    const result = screen.queryByText(/WPM/i);
    expect(result).toBeNull();
  });
});
