
function changeState(action, queryString) {
  if (window.history.pushState) {
    const newurl = `${
      window.location.protocol
    }//${
      window.location.host
    }${
      window.location.pathname
    }${
      queryString
    }`;
    return window.history[action]({ path: newurl }, '', newurl);
  }
  return null;
}

export function pushHistoryState(queryString = '') {
  changeState('pushState', queryString);
}

export function replaceHistoryState(queryString = '') {
  changeState('replaceState', queryString);
}
