import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const { renderPage, publicRoutes, getSeoMetadata, getStructuredData, siteOrigin: origin } = await import(pathToFileURL(join(process.cwd(), '.seo-ssr/entry-server.js')))
const template = await readFile('dist/index.html', 'utf8')

const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

for (const route of publicRoutes) {
  const { title, description } = getSeoMetadata(route)
  const url = origin ? `${origin}${route}` : ''
  const image = origin ? `${origin}/images/fire-sprinkler.webp` : '/images/fire-sprinkler.webp'
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    ...(url ? [`<link rel="canonical" href="${escapeHtml(url)}" />`, `<meta property="og:url" content="${escapeHtml(url)}" />`] : []),
    `<script id="business-structured-data" type="application/ld+json">${JSON.stringify(getStructuredData(route)).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n    ')
  const html = template
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/\s*<meta property="og:(?:title|description|url|image)"[^>]*>/g, '')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace('</head>', `    ${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderPage(route)}</div>`)
  const output = route === '/' ? 'dist/index.html' : join('dist', route.slice(1), 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, html)
}

await rm('.seo-ssr', { recursive: true, force: true })
