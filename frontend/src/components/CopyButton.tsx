import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';

export default function CopyButton({
  initialText,
  copiedText,
  link,
}: {
  initialText: string;
  copiedText: string;
  link: string;
}) {
  const [buttonCopyText, setButtonCopyText] = useState(initialText);

  const copyUrlButton = () => {
    navigator.clipboard.writeText(link).then(() => {
      setButtonCopyText(copiedText);
      setTimeout(() => {
        setButtonCopyText(initialText);
      }, 3000);
    });
  };

  return (
    <Button onClick={copyUrlButton} variant='secondary' className='w-fit mx-auto'>
      {buttonCopyText}
    </Button>
  );
}
