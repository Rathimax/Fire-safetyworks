import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { business, customerRatings, projectPhotos, type CustomerRating, type ProjectPhoto } from './business'

export const supabaseConfig = { url: import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, ''), anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY }
export const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || business.email).trim().toLowerCase()

type SiteContent = { customersServed: number; reviews: CustomerRating[]; projects: ProjectPhoto[] }
type ReviewContentRow = { venue: string; customer: string; rating: number; location: string | null; feedback_before: string; feedback_highlight: string; feedback_after: string }
type ProjectContentRow = { image_url: string; alt: string; title: string; category: string }
type ContentContext = SiteContent & { refresh: () => Promise<void> }
const defaults: SiteContent = { customersServed: business.customersServed, reviews: customerRatings, projects: projectPhotos }
const Context = createContext<ContentContext>({ ...defaults, refresh: async () => {} })

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaults)
  const refresh = useCallback(async () => {
    const { url, anonKey } = supabaseConfig
    if (!url || !anonKey) return
    const headers = { apikey: anonKey }
    const [settingsResponse, reviewsResponse, projectsResponse] = await Promise.all([
      fetch(`${url}/rest/v1/site_settings?select=customers_served&key=eq.main&limit=1`, { headers }),
      fetch(`${url}/rest/v1/reviews?select=venue,customer,rating,location,feedback_before,feedback_highlight,feedback_after&published=eq.true&order=created_at.desc`, { headers }),
      fetch(`${url}/rest/v1/projects?select=image_url,alt,title,category&published=eq.true&order=sort_order.asc`, { headers }),
    ])
    if (!settingsResponse.ok || !reviewsResponse.ok || !projectsResponse.ok) return
    const [settings, reviews, projects] = await Promise.all([settingsResponse.json(), reviewsResponse.json(), projectsResponse.json()]) as [{ customers_served: number }[], ReviewContentRow[], ProjectContentRow[]]
    setContent({
      customersServed: settings[0]?.customers_served ?? defaults.customersServed,
      reviews: reviews.map(row => ({ venue: row.venue, customer: row.customer, rating: row.rating, ...(row.location ? { location: row.location } : {}), feedback: { before: row.feedback_before, highlight: row.feedback_highlight, after: row.feedback_after } })),
      projects: projects.map(row => ({ image: row.image_url, alt: row.alt, title: row.title, category: row.category })),
    })
  }, [])
  useEffect(() => { void refresh().catch(() => {}) }, [refresh])
  const value = useMemo(() => ({ ...content, refresh }), [content, refresh])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useSiteContent() { return useContext(Context) }
