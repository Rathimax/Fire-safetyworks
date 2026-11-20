import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'

async function readConfiguredOrigin() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL
  for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
    try {
      const content = await readFile(file, 'utf8')
      const match = content.match(/^\s*VITE_SITE_URL\s*=\s*(.*?)\s*$/m)
      if (match) return match[1].replace(/^['"]|['"]$/g, '')
    } catch { /* Optional environment file. */ }
  }
  return ''
}

const origin = (await readConfiguredOrigin()).replace(/\/$/, '')
const routes = [
  '/', '/about', '/services', '/services/fire-sprinkler-installation',
  '/services/firefighting-water-pipeline', '/services/fire-extinguishers-equipment',
  '/services/fire-alarm-systems', '/services/fire-safety-maintenance', '/projects',
  '/reviews', '/contact', '/privacy', '/terms',
]
await mkdir('public', { recursive: true })
if (origin) {
  const entries = routes.map(path => `  <url><loc>${origin}${path}</loc></url>`).join('\n')
  await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`)
  await writeFile('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
} else {
  try { await unlink('public/sitemap.xml') } catch { /* No generated sitemap to remove. */ }
  await writeFile('public/robots.txt', 'User-agent: *\nAllow: /\n')
}
