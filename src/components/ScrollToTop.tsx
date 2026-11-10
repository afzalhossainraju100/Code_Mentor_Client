import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll to the top on page changes (but keep in-page #anchor links working). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
