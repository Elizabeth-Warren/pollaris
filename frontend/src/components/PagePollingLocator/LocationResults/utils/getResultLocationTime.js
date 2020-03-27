import replaceTemplateVars from 'wr/utils/replaceTemplateVars'

/**
 * Displayable time for specific location.
 * @param {String} datesHours Data populated from pollaris.
 * @param {Object} textOverride Text provided from contentful.
 * @return {String} Displayable time.
 */
function getResultLocationTime(datesHours, textOverride) {
  if (textOverride) {
    return replaceTemplateVars(textOverride, [['{{DATES_HOURS}}', datesHours]])
  }

  return datesHours
}

export default getResultLocationTime
