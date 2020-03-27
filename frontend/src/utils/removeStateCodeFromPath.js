export default function removeStateCodeFromPath(path) {
  if (path && path.indexOf('--') > -1) {
    return path.split('--')[0];
  }

  return path;
}
