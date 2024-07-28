import { type languagesType } from '@/types';
import { useEffect, useState } from 'react';
import { languages } from '../constants/languages.ts';
import { getText } from '@/services/gameService.ts';

export default function useGetText(language: languagesType = languages.en, phrase?: string) {
  const [phraseArray, setPhraseArray] = useState<string[]>([]);

  const setText = (text: string) => {
    const textArray = Array.from(text.toLowerCase());
    setPhraseArray(textArray);
  };

  const fetchText = async () => {
    try {
      const text = await getText({ lang: language });
      setText(text.phrase);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!phrase) {
      fetchText().catch((e) => {
        console.error(e);
      });
    } else {
      setText(phrase);
    }
  }, [language, phrase]);

  return { fetchText, phraseArray, setText };
}
