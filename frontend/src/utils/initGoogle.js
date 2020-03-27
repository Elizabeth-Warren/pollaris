import load from 'little-loader'
import getPageTranslation from 'wr/utils/getPageTranslation'

const GOOGLE_MAP_PLACES_API = 'https://maps.googleapis.com/maps/api/js'

function initGoogle(callback) {
  try {
    // TODO: LOCALIZATION - Add back in with localization,
    // const language = getPageTranslation()
    // const setLang = language && language.split('-');
    const setLang = ['en']
    load(
      `${GOOGLE_MAP_PLACES_API}?key=${process.env.GOOGLE_CLOUD_KEY}&libraries=places&maps&language=${setLang[0]}`,
      callback
    )
  } catch (err) {
    console.log(err)
  }
}

export default initGoogle
