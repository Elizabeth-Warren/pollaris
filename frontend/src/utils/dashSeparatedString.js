import replaceSpaceWithCharacter from './replaceSpaceWithCharacter'

function dashSeparatedString(stepTitle) {
  return `${replaceSpaceWithCharacter(stepTitle, '-').toLowerCase()}`
}

export default dashSeparatedString
