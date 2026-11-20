import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './site/App'
export { getSeoMetadata, getStructuredData, publicRoutes, siteOrigin } from './data/seo'

export function renderPage(pathname: string) {
  return renderToString(<StaticRouter location={pathname}><App /></StaticRouter>)
}
