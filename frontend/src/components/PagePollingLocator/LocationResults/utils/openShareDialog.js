import makeSharePath from './makeSharePath'

export function openTwitterShare(content, overrideUrl) {
  const text = `${content}\n${overrideUrl || makeSharePath()}`
  const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}`
  window.open(
    twitterShareLink,
    'tweet',
    'width=500,height=384,menubar=no,status=no,toolbar=no'
  )
}

export function openFacebookShare(quote, overrideUrl) {
  const facebookShareLink = `http://www.facebook.com/share.php?u=${encodeURIComponent(
    overrideUrl || makeSharePath()
  )}`
  const quoteText = quote ? `&quote=${encodeURIComponent(quote)}` : ''

  window.open(
    facebookShareLink + quoteText,
    'share',
    'width=500,height=300,menubar=no,status=no,toolbar=no'
  )
}
