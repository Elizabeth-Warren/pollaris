import { useEffect, useState } from 'react'
import makeSourcedLink from 'wr/utils/makeSourcedLink'

// @NOTE: The server does not render ads sourced actble links,
// and we do not want the client to render ads sourced links
// until after the first paint to avoid hydration conflicts.

export default function useSourcedLink() {
  const [
    makeSourcedLinkOverride,
    setMakeSourcedLinkOverride,
  ] = useState(() => link => link)

  useEffect(() => setMakeSourcedLinkOverride(() => makeSourcedLink), [])

  return [makeSourcedLinkOverride]
}
