/**
 * Splits out rich text nodes into headings and content group, dependent on
 * a heading seperator type i.e. heading-1, heading-2 etc.
 * @param {String} seperator Rich text nodeType used to identify intended seperation.
 * @param {Object} richTextNodes Rich text nodes to parse.
 * @param {Boolean} isolateSeperatorsInContent Remove headers from the child groups
 *
 * @returns {Object} separatedProperties
 * @returns {Array} separatedProperties.headings - Heading rich text nodes.
 * @returns {Array} separatedProperties.content - Content rich text nodes.
 */
function transformRichTextGrouping(
  seperator,
  richTextNodes,
  isolateSeperatorsInContent = true
) {
  function isSeperator(node) {
    return node.nodeType === seperator
  }

  function findChildGroups() {
    return richTextNodes.reduce((accum, node) => {
      if (isSeperator(node)) {
        if (isolateSeperatorsInContent) {
          return [...accum, []]
        }

        return [...accum, [node]]
      }

      accum[accum.length - 1].push(node)
      return accum
    }, [])
  }

  const isolatedSeperators = richTextNodes
    .map(node => (isSeperator(node) ? node : null))
    .filter(node => node)

  return {
    headings: isolatedSeperators,
    content: findChildGroups(),
  }
}

export default transformRichTextGrouping
