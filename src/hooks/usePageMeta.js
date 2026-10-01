import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* global __SITE_URL__ */
// Set at build time by seo.plugin.js.
const SITE_URL = typeof __SITE_URL__ === 'string' ? __SITE_URL__ : window.location.origin

const SITE_NAME = 'MediPrice Cameroon'
const DEFAULT_DESCRIPTION =
  'Compare what pharmacies, labs and hospitals in Bamenda charge for medicines and tests, and see who checked each price.'

/** Finds or creates a <meta>/<link> tag in <head>. */
function headTag(tag, attribute, key) {
  let element = document.head.querySelector(`${tag}[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement(tag)
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  return element
}

/**
 * Sets the page title, description, canonical URL and social tags for the
 * current route. Google renders JavaScript, so it sees these per page; link
 * preview bots (WhatsApp, Facebook) only read the defaults in index.html.
 *
 * @param {{ title?: string, description?: string, noindex?: boolean, canonicalPath?: string }} meta
 */
export default function usePageMeta({ title, description = DEFAULT_DESCRIPTION, noindex = false, canonicalPath } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Compare healthcare prices in Bamenda`
    // Canonical URLs drop query strings, so filtered lists don't compete with the main list.
    const url = `${SITE_URL}${canonicalPath ?? pathname}`

    document.title = fullTitle
    headTag('meta', 'name', 'description').setAttribute('content', description)
    headTag('meta', 'name', 'robots').setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')
    headTag('link', 'rel', 'canonical').setAttribute('href', url)
    headTag('meta', 'property', 'og:title').setAttribute('content', fullTitle)
    headTag('meta', 'property', 'og:description').setAttribute('content', description)
    headTag('meta', 'property', 'og:url').setAttribute('content', url)
    headTag('meta', 'name', 'twitter:title').setAttribute('content', fullTitle)
    headTag('meta', 'name', 'twitter:description').setAttribute('content', description)
  }, [title, description, noindex, canonicalPath, pathname])
}

export { SITE_URL }
