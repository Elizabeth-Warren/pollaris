/**
 * Replace all occurences of a string with another string.
 *
 * @param  {String} input
 * @param  {Array<String,String>} map
 * @return {String}
 */
export default function replaceTemplateVars(input, map) {
  let template = input

  for (const templateVar of map) {
    const [target, value] = templateVar

    const re = new RegExp(target, 'g')
    template = template.replace(re, value)
  }

  return template
}
