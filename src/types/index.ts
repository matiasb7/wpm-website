import { type languages } from '../constants/languages'

export type languagesType = typeof languages[keyof typeof languages]

export interface timeInterface {
  start: number | null
  end: number | null
}

export interface ScoreWPM {
  wpm: number
  accuracy: number
  timeStamp: Date
}

export interface ScoreWPMInterface extends Array<ScoreWPM> {}
