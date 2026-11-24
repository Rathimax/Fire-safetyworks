import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './site/App'
import { SiteContentProvider } from './data/site-content'
import './site/styles.css'
import './site/refinements.css'

try {
  if (window.localStorage.getItem('fire-safety-theme') === 'dark') document.documentElement.classList.add('dark')
} catch { /* Keep the default light theme when storage is unavailable. */ }

const root = document.getElementById('root')

if (!root) throw new Error('Application root element is missing.')

ReactDOM.createRoot(root).render(
  <React.StrictMode><SiteContentProvider><BrowserRouter><App /></BrowserRouter></SiteContentProvider></React.StrictMode>,
)
