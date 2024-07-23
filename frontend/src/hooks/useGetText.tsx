import { type languagesType } from '../types';
import { useEffect, useState } from 'react';
import { getRandomText } from '../utils/getRandomText.tsx';
import { languages } from '../constants/languages.ts';

export default function useGetText(language: languagesType = languages.en) {
  const [phraseArray, setPhraseArray] = useState<string[]>([]);

  const setText = (text: string) => {
    const textArray = Array.from(text.toLowerCase());
    setPhraseArray(textArray);
  };

  const fetchText = async () => {
    const fetchedText = await getRandomText(language);
    // const fetchedText = 'da'
    setText(fetchedText);
  };

  useEffect(() => {
    fetchText().catch((e) => {
      console.error(e);
    });
  }, [language]);

  return { fetchText, phraseArray, setText };
}
