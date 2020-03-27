import { useEffect } from 'react'

/**
 * Inserts the embed script for the "Beacon" Help Scout widget and exposes some
 * commonly used methods. See documentation here:
 * https://developer.helpscout.com/beacon-2/web/javascript-api/
 * @param {boolean} initOnMount - If true, runs the `init` method once the
 *   Beacon hook as mounted. Set this to false if you want to manually control
 *   when the wiget is initialized.
 */
const useBeacon = (
  initOnMount = true,
  configParams,
  env = process.env.BEACON_CALL_ID
) => {
  const init = () => {
    if (!window.Beacon) return
    window.Beacon('init', env)
  }

  const destroy = () => {
    if (!window.Beacon) return
    window.Beacon('destroy')
  }

  const open = () => {
    if (!window.Beacon) return
    window.Beacon('open')
  }

  const close = () => {
    if (!window.Beacon) return
    window.Beacon('close')
  }

  const config = () => {
    if (!window.Beacon) return
    window.Beacon('config', configParams)
  }

  const toggle = () => {
    if (!window.Beacon) return
    window.Beacon('toggle')
  }

  const insertScript = () => {
    if (window.Beacon) return
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.innerHTML =
      "!(function (e, t, n) { function a() { const e = t.getElementsByTagName('script')[0]; const n = t.createElement('script'); n.type = 'text/javascript', n.async = !0, n.src = 'https://beacon-v2.helpscout.net', e.parentNode.insertBefore(n, e); } if (e.Beacon = n = function (t, n, a) { e.Beacon.readyQueue.push({ method: t, options: n, data: a }); }, n.readyQueue = [], t.readyState === 'complete') return a(); e.attachEvent ? e.attachEvent('onload', a) : e.addEventListener('load', a, !1); }(window, document, window.Beacon || (() => {})));"
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(s)
  }

  useEffect(() => {
    insertScript()
    if (initOnMount) {
      init()
    }

    if (configParams) {
      config()
    }

    return destroy
  }, [])

  return {
    init,
    destroy,
    open,
    close,
    toggle,
  }
}

export default useBeacon
