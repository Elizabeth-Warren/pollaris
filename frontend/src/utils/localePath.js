import getPageTranslation from './getPageTranslation'
import removeStateCodeFromPath from './removeStateCodeFromPath'

export default function localePath(fields, fallbackToEnglish = false) {
  function check(value) {
    if (!fallbackToEnglish) {
      return value
    }

    if ((!value || !value.length) && fallbackToEnglish) {
      return fields['enUsPath']
    }

    return value
  }

  let path = ''

  switch (getPageTranslation()) {
    case 'en-US':
      path = check(fields['enUsPath'])
      break
    case 'es-MX':
      path = check(fields['esMxPath'])
      break
    default:
      break
  }

  return removeStateCodeFromPath(path)
}
