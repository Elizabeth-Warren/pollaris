export const ENGLISH = 'en-US'

export const SPANISH = 'es-MX'

export const states = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
}

export const territories = {
  AS: 'American Samoa',
  GU: 'Guam',
  MP: 'Northern Mariana Islands',
  PR: 'Puerto Rico',
  VI: 'Virgin Islands',
}

export const associations = {
  FM: 'Federated States of Micronesia',
  MH: 'Marshall Islands',
  PW: 'Palau',
}

export const armedForces = {
  AE: 'Armed Forces Europe, the Middle East, and Canada',
  AP: 'Armed Forces Pacific',
  AA: 'Armed Forces Americas',
}

export const all = {
  ...states,
  ...territories,
  ...associations,
  ...armedForces,
}

export const translatedAll = {
  [ENGLISH]: {
    ...all,
  },
  [SPANISH]: {
    ...all,
    DC: 'Distrito de Columbia',
    NJ: 'Nueva Jersey',
    NM: 'Nuevo Mexico',
    NY: 'Nueva York',
    NC: 'Carolina del Norte',
    ND: 'Dakota del Norte',
    PA: 'Pensilvania',
    SC: 'Carolina del Sur',
    SD: 'Dakota del Sur',
  },
}

/**
 * Lookup the name of a state for the given two letter code and language.
 *
 * @param  {String} [code='']
 * @param  {String} [language='en-US']
 * @return {String|null}
 */
export function lookup(code = '', language = ENGLISH) {
  if (!code || typeof code !== 'string' || !code.length) {
    return null
  }

  if (
    !language ||
    typeof language !== 'string' ||
    !language.length ||
    !translatedAll[language]
  ) {
    return null
  }

  return translatedAll[language][code.toUpperCase()] || null
}

/**
 * Reverse-lookup the code of a state based on the name.
 *
 * @param  {String} [name='']
 * @return {String|null}
 */
export function reverseLookup(name = '') {
  if (!name || typeof name !== 'string' || !name.length) {
    return null
  }

  const names = Object.values(all).map(name => name.toLowerCase())
  const codeIndex = names.indexOf(name.toLowerCase())

  if (codeIndex < 0) {
    return null
  }

  return Object.keys(all)[codeIndex]
}
