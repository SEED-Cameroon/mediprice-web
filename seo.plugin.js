/**
 * Build-time SEO for a single-page app:
 *  - replaces %SITE_URL% in index.html and defines __SITE_URL__ for the app
 *  - emits robots.txt and sitemap.xml (with every item and provider page)
 *
 * Site URL: VITE_SITE_URL, else Vercel's production domain (set automatically
 * on Vercel builds), else http://localhost:5173.
 */

const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/medications', changefreq: 'daily', priority: '0.9' },
  { path: '/labs-services', changefreq: 'daily', priority: '0.9' },
  { path: '/search', changefreq: 'weekly', priority: '0.5' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
]

// Staff pages and personal views are kept out of search results.
// Robots rules match by prefix, so "/provider" would also hide the public
// /providers/... pages: "/provider$" and "/provider/" target only the portal.
const DISALLOW = ['/admin', '/provider$', '/provider/', '/sign-in', '/compare']

export function resolveSiteUrl(env = process.env) {
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  return (env.VITE_SITE_URL || vercel || 'http://localhost:5173').replace(/\/+$/, '')
}

/** Absolute API base for build-time requests (a relative /api can't be fetched at build). */
function buildApiBase(env) {
  const candidate = env.SITEMAP_API_URL || env.VITE_API_URL
  return candidate && /^https?:\/\//.test(candidate) ? candidate.replace(/\/+$/, '') : null
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`${res.status}`)
    return (await res.json()).data ?? []
  } finally {
    clearTimeout(timer)
  }
}

/** Item and provider pages from the API, or [] if it can't be reached at build time. */
async function dynamicPages(env, log) {
  const api = buildApiBase(env)
  if (!api) {
    log('sitemap: no absolute VITE_API_URL or SITEMAP_API_URL, so only the main pages are listed')
    return []
  }
  try {
    const [medications, services, providers] = await Promise.all([
      fetchJson(`${api}/medications?limit=100`),
      fetchJson(`${api}/services?limit=100`),
      fetchJson(`${api}/providers`),
    ])
    const page = (prefix, priority) => (doc) => ({
      path: `${prefix}/${doc._id}`,
      lastmod: doc.updatedAt?.slice(0, 10),
      changefreq: 'weekly',
      priority,
    })
    return [
      ...medications.map(page('/medications', '0.8')),
      ...services.map(page('/labs-services', '0.8')),
      ...providers.map(page('/providers', '0.6')),
    ]
  } catch (error) {
    log(`sitemap: couldn't reach the API (${error.message}), so only the main pages are listed`)
    return []
  }
}

const xmlEscape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function sitemapXml(siteUrl, pages) {
  const urls = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${xmlEscape(siteUrl + page.path)}</loc>\n` +
        (page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function robotsTxt(siteUrl) {
  return ['User-agent: *', 'Allow: /', ...DISALLOW.map((path) => `Disallow: ${path}`), '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n')
}

export default function seoPlugin() {
  const siteUrl = resolveSiteUrl()

  return {
    name: 'mediprice-seo',
    config() {
      return { define: { __SITE_URL__: JSON.stringify(siteUrl) } }
    },
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl)
    },
    async generateBundle() {
      const pages = [...STATIC_PAGES, ...(await dynamicPages(process.env, (message) => this.warn(message)))]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl, pages) })
    },
  }
}
