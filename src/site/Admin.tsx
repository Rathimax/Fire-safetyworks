import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js'
import LogOut from 'lucide-react/dist/esm/icons/log-out.js'
import Moon from 'lucide-react/dist/esm/icons/moon.js'
import Plus from 'lucide-react/dist/esm/icons/plus.js'
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.js'
import Sun from 'lucide-react/dist/esm/icons/sun.js'
import Trash2 from 'lucide-react/dist/esm/icons/trash-2.js'
import Upload from 'lucide-react/dist/esm/icons/upload.js'
import Eye from 'lucide-react/dist/esm/icons/eye.js'
import EyeOff from 'lucide-react/dist/esm/icons/eye-off.js'
import { isAdminEmail, supabaseConfig, useSiteContent } from '../data/site-content'
import './admin.css'

type ReviewRow = { id: string; venue: string; customer: string; rating: number; location: string | null }
type ProjectRow = { id: string; title: string; category: string; image_url: string; storage_path: string | null; sort_order: number }
const emptyReview = { venue: '', customer: '', rating: '5', location: '', feedback: '' }
const ratingStarKeys = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'] as const
const supabase = supabaseConfig.url && supabaseConfig.anonKey ? createClient(supabaseConfig.url, supabaseConfig.anonKey) : null

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const logoutDialog = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [count, setCount] = useState(12)
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [visibleProjects, setVisibleProjects] = useState(5)
  const [visibleReviews, setVisibleReviews] = useState(5)
  const [reviewForm, setReviewForm] = useState(emptyReview)
  const [projectForm, setProjectForm] = useState({ title: '', category: '', alt: '' })
  const [photo, setPhoto] = useState<File | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [darkMode, setDarkMode] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
  const { refresh: refreshPublicContent } = useSiteContent()

  const loadRecords = useCallback(async () => {
    if (!supabase) return
    const [settings, reviewResult, projectResult] = await Promise.all([
      supabase.from('site_settings').select('customers_served').eq('key', 'main').maybeSingle(),
      supabase.from('reviews').select('id,venue,customer,rating,location').order('created_at', { ascending: false }),
      supabase.from('projects').select('id,title,category,image_url,storage_path,sort_order').order('sort_order', { ascending: true }),
    ])
    const issue = settings.error || reviewResult.error || projectResult.error
    if (issue) throw issue
    setCount(settings.data?.customers_served ?? 12)
    setReviews(reviewResult.data || [])
    setProjects(projectResult.data || [])
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => listener.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!isAdminEmail(session?.user.email)) {
      if (session) { void supabase?.auth.signOut(); setSession(null) }
      return
    }
    void loadRecords().catch(() => setError('Could not load console data. Check the Supabase setup and access policies.'))
  }, [loadRecords, session])
  useEffect(() => {
    const dialog = logoutDialog.current
    if (!dialog) return
    if (showLogoutConfirmation && !dialog.open) dialog.showModal()
    else if (!showLogoutConfirmation && dialog.open) dialog.close()
  }, [showLogoutConfirmation])
  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setDarkMode(root.classList.contains('dark'))
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const next = !darkMode
    document.documentElement.classList.toggle('dark', next)
    try { window.localStorage.setItem('fire-safety-theme', next ? 'dark' : 'light') } catch { /* Theme still changes for this session. */ }
    setDarkMode(next)
  }

  const refreshConsoleData = async () => {
    if (!supabase || refreshing || busy) return
    setRefreshing(true); setError('')
    try {
      await Promise.all([loadRecords(), refreshPublicContent()])
    } catch {
      setError('Could not refresh console data. Check your connection and administrator access.')
    } finally {
      setRefreshing(false)
    }
  }

  const login = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setError('')
    const result = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (result.error) setError('Sign-in failed. Check your email and password, then try again.')
    else if (!isAdminEmail(result.data.user.email)) {
      await supabase.auth.signOut()
      setError('This account is not on the administrator allowlist.')
    } else setPassword('')
  }

  const logout = async () => {
    if (!supabase) return
    setBusy(true)
    setError('')
    try {
      const { error: issue } = await supabase.auth.signOut({ scope: 'local' })
      if (issue) setError('The local session was cleared, but sign-out could not be confirmed. Please reload this page.')
    } catch {
      setError('The local session was cleared, but sign-out could not be confirmed. Please reload this page.')
    } finally {
      setSession(null)
      setEmail('')
      setPassword('')
      setBusy(false)
    }
  }

  const saveCount = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !Number.isInteger(count) || count < 0 || count > 1000000) return setError('Enter a whole number from 0 to 1,000,000.')
    setBusy(true); setError('')
    const { error: issue } = await supabase.from('site_settings').upsert({ key: 'main', customers_served: count }, { onConflict: 'key' })
    setBusy(false)
    if (issue) setError('Could not save the customer count. Confirm your administrator access and database setup.')
    else await refreshPublicContent()
  }

  const addReview = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setError('')
    const { error: issue } = await supabase.from('reviews').insert({ venue: reviewForm.venue.trim(), customer: reviewForm.customer.trim(), rating: Number(reviewForm.rating), location: reviewForm.location.trim() || null, feedback_before: '', feedback_highlight: reviewForm.feedback.trim(), feedback_after: '', published: true })
    setBusy(false)
    if (issue) return setError('Could not add the review. Check the fields and administrator access.')
    setReviewForm(emptyReview); await loadRecords(); await refreshPublicContent()
  }

  const addProject = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !photo) return setError('Choose a project photo first.')
    if (!photo.type.startsWith('image/') || photo.size > 8 * 1024 * 1024) return setError('Choose an image file no larger than 8 MB.')
    setBusy(true); setError('')
    const extension = photo.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'img'
    const storagePath = `${crypto.randomUUID()}.${extension}`
    const upload = await supabase.storage.from('project-photos').upload(storagePath, photo, { contentType: photo.type, upsert: false })
    if (upload.error) { setBusy(false); return setError('Photo upload failed. Check the file type and administrator access.') }
    const { data: publicPhoto } = supabase.storage.from('project-photos').getPublicUrl(storagePath)
    const nextOrder = projects.reduce((highest, project) => Math.max(highest, project.sort_order), -1) + 1
    const result = await supabase.from('projects').insert({ title: projectForm.title.trim(), category: projectForm.category.trim(), alt: projectForm.alt.trim(), image_url: publicPhoto.publicUrl, storage_path: storagePath, sort_order: nextOrder, published: true })
    if (result.error) { await supabase.storage.from('project-photos').remove([storagePath]); setBusy(false); return setError('Could not save this project. Check the fields and administrator access.') }
    setBusy(false); setProjectForm({ title: '', category: '', alt: '' }); setPhoto(null)
    const input = document.getElementById('admin-project-photo') as HTMLInputElement | null
    if (input) input.value = ''
    await loadRecords(); await refreshPublicContent()
  }

  const removeReview = async (id: string) => {
    if (!supabase || !window.confirm('Delete this review from the website?')) return
    setBusy(true); setError('')
    const { error: issue } = await supabase.from('reviews').delete().eq('id', id)
    setBusy(false)
    if (issue) setError('Could not delete the review.')
    else { await loadRecords(); await refreshPublicContent() }
  }

  const removeProject = async (project: ProjectRow) => {
    if (!supabase || !window.confirm(`Delete “${project.title}” from the website?`)) return
    setBusy(true); setError('')
    const { error: issue } = await supabase.from('projects').delete().eq('id', project.id)
    if (issue) { setBusy(false); return setError('Could not delete the project.') }
    if (project.storage_path) await supabase.storage.from('project-photos').remove([project.storage_path])
    setBusy(false); await loadRecords(); await refreshPublicContent()
  }

  const adminNavbar = (
    <header className="admin-topbar">
      <Link className="admin-brand" to="/" aria-label="Go to Shree Ganga public website">
        <span className="admin-brand-mark" aria-hidden="true">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 54">
            <path d="M24 3 43 10v14c0 13-8 22-19 27C13 46 5 37 5 24V10L24 3Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M24 14c1 7-6 9-6 16a6 6 0 0 0 12 0c0-4-3-7-3-12 5 5 9 10 9 16a12 12 0 1 1-24 0c0-8 6-13 12-20Z" fill="currentColor" />
          </svg>
        </span>
        <span className="admin-brand-type">
          <b>SHREE GANGA</b>
          <small>ADMIN CONSOLE</small>
        </span>
      </Link>
      {session && (
        <nav className="admin-topbar-nav" aria-label="Admin sections">
          <a href="#admin-overview">Overview</a>
          <a href="#admin-count">Customers</a>
          <a href="#admin-projects">Projects</a>
          <a href="#admin-reviews">Reviews</a>
        </nav>
      )}
      <div className="admin-topbar-tools">
        {session && (
          <button
            type="button"
            className="admin-tool-btn"
            disabled={refreshing || busy}
            onClick={() => void refreshConsoleData()}
            aria-label="Refresh console data"
            title="Refresh console data"
          >
            <RefreshCw size={16} className={refreshing ? 'is-spinning' : undefined} aria-hidden="true" />
            <span>{refreshing ? 'Syncing…' : 'Refresh'}</span>
          </button>
        )}
        <Link className="admin-tool-btn" to="/" title="View public website">
          <ArrowUpRight size={15} aria-hidden="true" />
          <span>View site</span>
        </Link>
        <button
          type="button"
          className="admin-tool-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
          title={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
        >
          {darkMode ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
        {session && (
          <button
            type="button"
            className="admin-tool-btn admin-tool-danger"
            disabled={busy}
            onClick={() => setShowLogoutConfirmation(true)}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </header>
  )

  if (!supabase) return <main className="admin-shell">{adminNavbar}<section className="admin-login"><span className="admin-eyebrow">SHREE GANGA · ADMIN</span><h1>Admin console setup</h1><p>Add the Supabase project URL and public publishable key to <code>.env.local</code>, then add the same values to Vercel. Setup instructions are in the project README.</p></section></main>

  if (!session) return <main className="admin-shell">{adminNavbar}<form className="admin-login" onSubmit={login}><span className="admin-eyebrow">SHREE GANGA · ADMIN</span><h1>Sign in</h1><p>This console is for authorized administrators only.</p>{error && <p className="admin-error" role="alert">{error}</p>}<label>Email<input autoComplete="off" type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label><label>Password<span className="admin-password-field"><input autoComplete="current-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={event => setPassword(event.target.value)} /><button className="admin-password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(visible => !visible)}>{showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button></span></label><button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button></form></main>

  return <main className="admin-shell">{adminNavbar}<div className="admin-dashboard">
    <div className="admin-top">
      <div className="admin-heading"><span className="admin-eyebrow">SHREE GANGA · ADMIN</span><h1>Content manager</h1><p>Manage the information customers see on your website.</p></div>
      <div className="admin-account"><span title={session.user.email || ''}>{session.user.email}</span></div>
    </div>
    {error && <p className="admin-error" role="alert">{error}</p>}

    <section className="admin-stats" id="admin-overview" aria-label="Website content summary">
      <a className="admin-stat-card" href="#admin-count"><span>Customers served</span><strong>{count.toLocaleString()}</strong><small>Update site statistic <span aria-hidden="true">→</span></small></a>
      <a className="admin-stat-card" href="#admin-projects"><span>Completed projects</span><strong>{projects.length}</strong><small>Manage project gallery <span aria-hidden="true">→</span></small></a>
      <a className="admin-stat-card" href="#admin-reviews"><span>Customer reviews</span><strong>{reviews.length}</strong><small>Manage customer feedback <span aria-hidden="true">→</span></small></a>
    </section>

    <section className="admin-panel admin-count-panel" id="admin-count"><div><span className="admin-eyebrow">SITE STATISTIC</span><h2>Customers served</h2><p>This number appears on the home page.</p></div><form className="admin-inline-form" onSubmit={saveCount}><label className="sr-only" htmlFor="admin-customer-count">Customers served</label><input id="admin-customer-count" type="number" min="0" max="1000000" step="1" value={count} onChange={event => setCount(Number(event.target.value))}/><button disabled={busy} type="submit">Save</button></form></section>

    <section className="admin-panel admin-list-panel" id="admin-projects"><div className="admin-section-title"><div><span className="admin-eyebrow">PROJECT GALLERY</span><h2>Completed projects <small>{projects.length}</small></h2><p>Photos shown in the website project gallery.</p></div></div>
      <details className="admin-add"><summary><Plus size={17}/> Add a project</summary><form className="admin-content-form" onSubmit={addProject}><label>Project title<input required maxLength={120} value={projectForm.title} onChange={event => setProjectForm({ ...projectForm, title: event.target.value })}/></label><label>Category<input required maxLength={80} value={projectForm.category} onChange={event => setProjectForm({ ...projectForm, category: event.target.value })}/></label><label>Image description<input required maxLength={240} value={projectForm.alt} onChange={event => setProjectForm({ ...projectForm, alt: event.target.value })}/></label><label className="admin-file-label"><Upload size={16}/> Choose photo<input id="admin-project-photo" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required onChange={event => setPhoto(event.target.files?.[0] || null)}/></label>{photo && <span className="admin-file-name">{photo.name}</span>}<button disabled={busy} type="submit"><Plus size={16}/> Add project</button></form></details>
      <ul className="admin-record-list">{projects.slice(0, visibleProjects).map(project => <li key={project.id}><img src={project.image_url} alt=""/><span><b>{project.title}</b><small>{project.category}</small></span><button type="button" aria-label={`Delete ${project.title}`} title={`Delete ${project.title}`} onClick={() => void removeProject(project)}><Trash2 size={16}/></button></li>)}</ul>
      {projects.length > visibleProjects && <button className="admin-load-more" type="button" onClick={() => setVisibleProjects(current => current + 5)}>Load more projects <span>({projects.length - visibleProjects} remaining)</span></button>}
    </section>

    <section className="admin-panel admin-list-panel" id="admin-reviews"><div className="admin-section-title"><div><span className="admin-eyebrow">CUSTOMER FEEDBACK</span><h2>Reviews <small>{reviews.length}</small></h2><p>Only publish feedback approved by the customer.</p></div></div>
      <details className="admin-add"><summary><Plus size={17}/> Add a review</summary><form className="admin-content-form admin-review-form" onSubmit={addReview}><label>Venue<input required maxLength={120} value={reviewForm.venue} onChange={event => setReviewForm({ ...reviewForm, venue: event.target.value })}/></label><label>Customer name<input required maxLength={100} value={reviewForm.customer} onChange={event => setReviewForm({ ...reviewForm, customer: event.target.value })}/></label><label>Location (optional)<input maxLength={100} value={reviewForm.location} onChange={event => setReviewForm({ ...reviewForm, location: event.target.value })}/></label><fieldset className="admin-rating-picker"><legend>Rating <small>Tap once for half a star; tap again for a full star.</small></legend><div>{[1, 2, 3, 4, 5].map(value => { const rating = Number(reviewForm.rating); const selected = rating >= value - 0.5; const full = rating >= value; return <button key={value} className={`${full ? 'is-selected' : ''} ${selected && !full ? 'is-half' : ''}`} type="button" aria-label={`Set rating to ${value - 0.5} stars, tap again for ${value} stars`} aria-pressed={selected} onClick={() => setReviewForm({ ...reviewForm, rating: String(rating === value - 0.5 ? value : value - 0.5) })}>{selected ? '★' : '☆'}</button> })}</div><output aria-live="polite">{reviewForm.rating} / 5 stars</output></fieldset><label className="admin-feedback-field">Customer feedback<textarea required maxLength={180} rows={4} value={reviewForm.feedback} onChange={event => setReviewForm({ ...reviewForm, feedback: event.target.value })} placeholder="Write the customer’s feedback in a sentence or two."/><small>{reviewForm.feedback.length}/180 characters</small></label><button disabled={busy} type="submit"><Plus size={16}/> Add review</button></form></details>
      <ul className="admin-record-list">{reviews.slice(0, visibleReviews).map(review => <li key={review.id}><span className="admin-rating" role="img" aria-label={`${review.rating} out of 5 stars`}>{ratingStarKeys.map((starKey, index) => { const remaining = review.rating - index; return <span aria-hidden="true" className={remaining >= 1 ? 'is-filled' : remaining >= 0.5 ? 'is-half' : ''} key={starKey}>★</span> })}</span><span><b>{review.venue}</b><small>{review.customer}{review.location ? ` · ${review.location}` : ''}</small></span><button type="button" aria-label={`Delete review for ${review.venue}`} title={`Delete review for ${review.venue}`} onClick={() => void removeReview(review.id)}><Trash2 size={16}/></button></li>)}</ul>
      {reviews.length > visibleReviews && <button className="admin-load-more" type="button" onClick={() => setVisibleReviews(current => current + 5)}>Load more reviews <span>({reviews.length - visibleReviews} remaining)</span></button>}
    </section>
    <p className="admin-footnote">Only add project work and customer feedback approved for public display. Current built-in site content remains as a fallback until you add records here.</p>
  </div><dialog ref={logoutDialog} className="admin-confirm-dialog" aria-labelledby="logout-title" onCancel={event => { event.preventDefault(); setShowLogoutConfirmation(false) }}><span className="admin-eyebrow">SHREE GANGA · ADMIN</span><h2 id="logout-title">Sign out?</h2><p>Are you sure you want to sign out of the admin console?</p><div><button type="button" className="admin-secondary" onClick={() => setShowLogoutConfirmation(false)}>Cancel</button><button type="button" onClick={() => { setShowLogoutConfirmation(false); void logout() }}>Sign out</button></div></dialog></main>
}
