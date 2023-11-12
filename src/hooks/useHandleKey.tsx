import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { type ScoreWPMInterface, type timeInterface } from '../types'
import calcScore from '../utils/calcScore.tsx'
import confetti from 'canvas-confetti'
interface useKeywordEntryParams {
  phraseArray: string[]
  textLength: React.MutableRefObject<number>
  setWPMScore: React.Dispatch<React.SetStateAction<ScoreWPMInterface>>
  fetchText: () => Promise<void>
}

export function useHandleKey ({ phraseArray, textLength, setWPMScore, fetchText }: useKeywordEntryParams) {
  const [inputKey, setInputKey] = useState<string>('')
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0)
  const time = useRef<timeInterface>({ start: null, end: null })
  const inputErrors = useRef<number>(0)

  const onKeyPress = (button: string) => {
    setInputKey(button) // Highlight the button on virtual keyboard press
  }

  const finishPhrase = () => {
    const endTime = Date.now()
    if (time.current.start == null) return
    const { wpmScore } = calcScore(time.current.start, endTime, textLength.current)
    const accuracyScore = (textLength.current / inputErrors.current)

    setWPMScore((prev: ScoreWPMInterface) => [
      ...prev,
      { wpm: wpmScore, timeStamp: endTime, accuracy: accuracyScore }
    ] as ScoreWPMInterface)

    void confetti({ particleCount: 300, spread: 300 })
    fetchText().catch(e => { console.error(e) })
  }

  const reset = () => {
    setCurrentKeyIndex(0)
    setInputKey('')
    time.current = { start: null, end: null }
  }

  useEffect(() => {
    reset()
  }, [phraseArray])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      const key = event.key === ' ' ? '{space}' : event.key.toLowerCase()
      setInputKey(key)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const correctKey = phraseArray[currentKeyIndex] === ' ' ? '{space}' : phraseArray[currentKeyIndex]
    if (currentKeyIndex === 0) {
      time.current = { start: Date.now(), end: null }
    }

    if (inputKey === correctKey) {
      if (currentKeyIndex === textLength.current - 1) {
        finishPhrase()
        inputErrors.current = 0
      } else {
        setCurrentKeyIndex(currentKeyIndex + 1)
        setInputKey('')
      }
    } else {
      inputErrors.current += 1
    }
  }, [inputKey])

  return { inputKey, onKeyPress, currentKeyIndex }
}
