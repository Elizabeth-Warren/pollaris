import replaceTemplateVars from 'wr/utils/replaceTemplateVars'

/**
 * Interpolates name variable into string from contentful if contentful string
 * exists, otherwise returns raw string from pollaris.
 * @param {String} precinctCode Code from pollaris result.
 * @param {Object} specificSettings State specific settings from contentful.
 * @param {Object} specificLocation Specific location from voting locations.
 * @return {String} Displayable Location name.
 */
function getLocationName(precinctCode, specificSettings, specificLocation) {
  if (specificSettings.customLocationNamePrefix && precinctCode) {
    return (
      replaceTemplateVars(specificSettings.customLocationNamePrefix, [
        ['{{PRECINCT_CODE}}', precinctCode.toUpperCase()],
      ]) + specificLocation.location_name
    )
  }

  return specificLocation.location_name
}

export default getLocationName
