/**
 * For generic URL's/internal paths only.
 * Use makeActblueLink for donation specific links.
 */
export default function makeSourcedLink(url = '', strictFiltering = false) {
  if (!url || !url.length) {
    return '';
  }

  const queryString = window.location.search;

  if (!queryString || !queryString.length) {
    return url;
  }

  const [beforeHash, hash] = url.split('#');
  const hasHash = hash && hash.length;

  const [baseUrl, defaultQuery = ''] = beforeHash.split('?');

  const defaultParams = defaultQuery.split('&');
  const currentParams = queryString.replace('?', '').split('&').filter((param) => !param.includes('query='));
  const finalParams = [...currentParams];

  for (const param of defaultParams) {
    if (!param.length) {
      continue;
    }

    const [key] = param;

    if (!finalParams.find((compare) => compare[0] === key)) {
      finalParams.push(param);
    }
  }

  const isFileDownload = (href) => href.match(/\.(pdf|jpeg|jpg|png|doc|docx|ppt|pptx|xls|slxs|epub|odp|ods|txt|rtf)$/i);

  if (isFileDownload(baseUrl)) {
    return baseUrl;
  }

  // Is external domain that is not actblue or BSD
  if (
    strictFiltering
    && !url.startsWith('/')
    && !url.includes('actblue.com')
    && !url.includes('elizabethwarren.com')
  ) {
    return baseUrl;
  }

  const finalQueryString = finalParams.join('&');
  const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const finalUrl = `${formattedBaseUrl}?${finalQueryString}${hasHash ? `#${hash}` : ''}`;

  return finalUrl;
}
