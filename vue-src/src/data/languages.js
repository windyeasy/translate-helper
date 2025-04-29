import _languages from './languages.json'


export const languagesByCode = _languages 
export const languages = Object.values(_languages)

export function getLanguageName(code) {
  return languagesByCode[code]?.name || code
}
