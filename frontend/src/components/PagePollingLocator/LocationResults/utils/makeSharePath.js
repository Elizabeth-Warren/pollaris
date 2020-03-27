export default function makeSharePath(explicitPath) {
  const { host, pathname, protocol } = window.location
  const url = `${protocol}//${host}${explicitPath || pathname}`

  return url
}
