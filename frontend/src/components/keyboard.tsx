import { type FunctionComponent, useRef } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

interface KeyboardWrapperProps {
  nextKey: string | null
  inputKey: string | null
  modifierClass: string | null
  onKeyPress: (button: string) => void
}

const KeyboardWrapper: FunctionComponent<KeyboardWrapperProps> = ({ nextKey, inputKey, onKeyPress, modifierClass }) => {
  const keyboardRef = useRef()

  const nextKeyFormatted = nextKey === ' ' ? '{space}' : nextKey

  const buttonTheme = []
  if ((nextKeyFormatted != null) && nextKeyFormatted.length !== 0) {
    buttonTheme.push({
      class: '!bg-green-200',
      buttons: nextKeyFormatted.toLowerCase()
    })
  }

  if (nextKeyFormatted != null &&
    inputKey != null &&
    inputKey.length !== 0 &&
    inputKey.toLowerCase() !== nextKeyFormatted.toLowerCase()
  ) {
    buttonTheme.push({
      class: '!bg-red-200',
      buttons: inputKey.toLowerCase()
    })
  }

  return (
      <div className={`pointer-events-none text-gray-700 ${modifierClass ?? ''}`}>
          <Keyboard
              keyboardRef={r => (keyboardRef.current = r)}
              layoutName='default'
              onKeyPress={onKeyPress}
              buttonTheme={buttonTheme}
          />
      </div>
  )
}

export default KeyboardWrapper
