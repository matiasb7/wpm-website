import type { languagesType } from '../types'
import enJson from '../data/phrases/en.json'
import esJson from '../data/phrases/es.json'

const languageToPathMap: Record<languagesType, string[]> = {
  en: enJson,
  es: esJson
}
export async function getRandomText (language: languagesType): Promise<string> {
  const texts = languageToPathMap[language]
  if (!texts || texts.length === 0) {
    throw new Error(`No texts found for language: ${language}`)
  }
  const randomIndex = Math.floor(Math.random() * texts.length)
  return texts[randomIndex]
}
