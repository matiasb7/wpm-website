import { type Player } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PhraseProps {
  players: Player[];
}

export default function Players({ players }: PhraseProps) {
  const orderedPlayers = players.sort((a, b) => b.wpm - a.wpm);
  return (
    <Table className='w-fit mt-10 mx-auto'>
      <TableHeader>
        <TableRow>
          <TableHead className=''>Position</TableHead>
          <TableHead className='w-[100px]'>Player</TableHead>
          <TableHead>Accuracy</TableHead>
          <TableHead>WPM</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderedPlayers.map(({ id, wpm, name, accuracy }, index) => {
          const accuracyPercentage = accuracy ? Math.round(Number(accuracy) * 100) + '%' : '-';
          return (
            <TableRow key={id} className=''>
              <TableCell className='font-medium'>{wpm ? index + 1 : '-'}</TableCell>
              <TableCell className='font-medium'>{name || '-'}</TableCell>
              <TableCell>{accuracyPercentage}</TableCell>
              <TableCell>{wpm}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
