import { type languagesType } from '../types'
import { useEffect, useRef, useState } from 'react'
import { getRandomText } from '../utils/getRandomText.tsx'

export default function useGetText (language: languagesType) {
  const [phraseArray, setPhraseArray] = useState<string[]>([])
  const textLength = useRef<number>(0)

  const setText = (text: string) => {
    const textArray = Array.from(text.toLowerCase())
    setPhraseArray(textArray)
    textLength.current = textArray.length
  }

  const fetchText = async () => {
    const fetchedText = await getRandomText(language)
    setText(fetchedText)
  }

  useEffect(() => {
    fetchText().catch(e => {
      console.error(e)
    })
  }, [language])

  return { fetchText, textLength, phraseArray, setText }
}
