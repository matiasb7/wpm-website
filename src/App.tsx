import KeyboardWrapper from './components/keyboard.tsx'
import { type FormEvent, useRef, useState } from 'react'
import { useHandleKey } from './hooks/useHandleKey.tsx'
import useGetText from './hooks/useGetText.tsx'
import { type languagesType, type ScoreWPMInterface } from './types'
import { languages } from './constants/languages.ts'
import Phrase from './components/Phrase.tsx'
import Score from './components/Score.tsx'
function App () {
  const changeTextRef = useRef<HTMLInputElement>(null)
  const [language, setLanguage] = useState<languagesType>(languages.en)
  const [WPMScore, setWPMScore] = useState<ScoreWPMInterface>([])
  const { fetchText, setText, textLength, phraseArray } = useGetText(language)
  const { inputKey, onKeyPress, currentKeyIndex } = useHandleKey({ phraseArray, textLength, setWPMScore, fetchText })
  const handleChangeText = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const textToChange = changeTextRef.current?.value
    if (!textToChange) return
    setText(textToChange)
    changeTextRef.current.value = ''
    changeTextRef.current.blur()
  }

  return (
    <>
        <main>
          <h1 className='text-5xl font-bold mb-16'>Typing Test</h1>
          <section>
            <div className='w-full'>
              <Phrase phraseArray={phraseArray} currentKeyIndex={currentKeyIndex} />
              <h2 className="text-2xl md:hidden w-full h-input">Open the site on desktop to test your skills!</h2>
              <KeyboardWrapper nextKey={phraseArray[currentKeyIndex]} inputKey={inputKey} onKeyPress={onKeyPress} modifierClass='hidden md:block' />
            </div>
            <aside className='hidden md:flex mt-16 min-w-[175px] flex-wrap justify-center items-center gap-10'>
              <div className='flex gap-4 items-center'>
                <span className='block'>Language</span>
                <div>
                  <button type='button' className={`h-btn rounded-l ${language === languages.en ? '!bg-gray-400' : ''}`} onClick={() => { setLanguage(languages.en) }}>{languages.en.toUpperCase()}</button>
                  <button type='button' className={`h-btn rounded-r ${language === languages.es ? '!bg-gray-400' : ''}`} onClick={() => { setLanguage(languages.es) }}>{languages.es.toUpperCase()}</button>
                </div>
              </div>
              <form onSubmit={handleChangeText}>
                 <input ref={changeTextRef} type='text' className='h-input' placeholder='Insert custom text' />
                  <button className='h-btn rounded ml-2' >Change Text</button>
              </form>
              <div>
                <button type='button' className='h-btn rounded' onClick={fetchText}>Random Text</button>
              </div>
            </aside>
          </section>
          {!!WPMScore.length && <Score modifierClass='hidden md:flex' wpm={WPMScore[WPMScore.length - 1]?.wpm} accuracy={WPMScore[WPMScore.length - 1]?.accuracy}/>}
        </main>
    </>
  )
}

export default App
