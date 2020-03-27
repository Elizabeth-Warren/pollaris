/**
 * Get the language to code to use for translated content on this page.
 *
 * @return {String}
 */
export default function getPageTranslation() {
  const { language } = window.cms_vars

  return language
}
