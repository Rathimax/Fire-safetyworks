import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js'
import Check from 'lucide-react/dist/esm/icons/check.js'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.js'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.js'
import Flame from 'lucide-react/dist/esm/icons/flame.js'
import House from 'lucide-react/dist/esm/icons/house.js'
import Images from 'lucide-react/dist/esm/icons/images.js'
import Info from 'lucide-react/dist/esm/icons/info.js'
import MapPin from 'lucide-react/dist/esm/icons/map-pin.js'
import Menu from 'lucide-react/dist/esm/icons/menu.js'
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.js'
import Phone from 'lucide-react/dist/esm/icons/phone.js'
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js'
import Star from 'lucide-react/dist/esm/icons/star.js'
import StarHalf from 'lucide-react/dist/esm/icons/star-half.js'
import X from 'lucide-react/dist/esm/icons/x.js'
import Wrench from 'lucide-react/dist/esm/icons/wrench.js'
import { business, customerRatings, navLinks, projectPhotos, services, type Service } from '../data/business'
import { getSeoMetadata, getStructuredData } from '../data/seo'
const ratingStarKeys = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'] as const
const serviceOptions = [...services.map(service => ({ value: service.slug, label: service.title })), { value: 'other', label: 'Others...' }]
const navIcons = { '/': House, '/about': Info, '/services': Wrench, '/projects': Images, '/reviews': Star }

function Metadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const { title, description } = getSeoMetadata(pathname)
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.append(meta) }
    meta.setAttribute('content', description || business.description)
    const titleMeta = document.querySelector('meta[property="og:title"]')
    titleMeta?.setAttribute('content', title)
    const descMeta = document.querySelector('meta[property="og:description"]')
    descMeta?.setAttribute('content', description || business.description)
    const urlMeta = document.querySelector('meta[property="og:url"]')
    if (urlMeta && business.siteUrl) urlMeta.setAttribute('content', `${business.siteUrl}${pathname}`)
    else urlMeta?.remove()
    const imageMeta = document.querySelector('meta[property="og:image"]')
    if (imageMeta && business.siteUrl) imageMeta.setAttribute('content', `${business.siteUrl}/images/fire-sprinkler.webp`)
    let structured = document.getElementById('business-structured-data') as HTMLScriptElement | null
    if (!structured) { structured = document.createElement('script'); structured.id = 'business-structured-data'; structured.type = 'application/ld+json'; document.head.append(structured) }
    structured.textContent = JSON.stringify(getStructuredData(pathname))
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (business.siteUrl) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
      canonical.href = `${business.siteUrl}${pathname}`
    } else canonical?.remove()
  }, [pathname])
  return null
}

function Logo({ onClick }: { onClick?: () => void }) {
  return <Link className="brand" to="/" aria-label={`${business.name}, home`} onClick={onClick}>
    <span className="brand-mark" aria-hidden="true"><svg role="presentation" viewBox="0 0 48 54"><path d="M24 3 43 10v14c0 13-8 22-19 27C13 46 5 37 5 24V10L24 3Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M24 14c1 7-6 9-6 16a6 6 0 0 0 12 0c0-4-3-7-3-12 5 5 9 10 9 16a12 12 0 1 1-24 0c0-8 6-13 12-20Z" fill="currentColor"/></svg></span>
    <span className="brand-type"><b>SHREE GANGA</b><small>FIRE &amp; SAFETY</small></span>
  </Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header"><div className="container header-inner"><Logo />
    <button type="button" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-controls="primary-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="primary-navigation" className={open ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
      {navLinks.map(item => {
        const Icon = navIcons[item.to as keyof typeof navIcons] || House
        return <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}><span className="nav-link-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.8}/></span>{item.label}</NavLink>
      })}
    </nav>
    <Link className="button button-light header-cta" to="/contact#enquiry-form">Get a quote <ArrowUpRight size={15} /></Link>
  </div></header>
}

function Footer() {
  return <footer className="footer"><div className="container footer-grid">
    <div className="footer-brand"><Logo /><p>{business.description}</p><div className="footer-contact"><a href={`tel:${business.phone}`}><Phone size={15} /> {business.phone}</a><a href={`mailto:${business.email}`}>{business.email}</a></div></div>
    <div className="footer-links footer-explore"><h3>Explore</h3>{navLinks.map(x => <Link key={x.to} to={x.to}>{x.label}</Link>)}<Link to="/contact#enquiry-form">Contact</Link></div>
    <div className="footer-links footer-services"><h3>Services</h3>{services.map(s => <Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}<span className="footer-area-list">Serving {business.serviceAreas.join(' · ')}</span></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {business.name}. All rights reserved.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div></footer>
}

function WhatsAppFloat() { return <a className="whatsapp-float" href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Hello, I would like to enquire about fire safety services.')}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><span className="wa-symbol" aria-hidden="true"><MessageCircle size={18}/></span><span>Chat on WhatsApp</span></a> }

function ServiceIcon({ service }: { service: Service }) {
  const Icon = service.icon === 'alarm' ? Flame : service.icon === 'maintenance' ? Check : service.icon === 'equipment' ? ShieldCheck : service.icon === 'pipeline' ? ArrowRight : Flame
  return <span className="service-icon"><Icon size={22} strokeWidth={1.7} /></span>
}

function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return <article className="service-card">
    <div className={`service-visual visual-${index % 5}`}>
      <img src={service.image} alt={service.imageAlt} loading="lazy" />
      <span className="visual-label">Illustrative image</span>
    </div>
    <div className="service-card-content"><ServiceIcon service={service} /><h3>{service.title}</h3><p>{service.short}</p>
      <div className="card-actions"><Link className="text-link" to={`/services/${service.slug}`}>Learn more <ArrowRight size={16} /></Link><Link className="quote-link" to={`/contact?service=${service.slug}#enquiry-form`}>Get a quote</Link></div>
    </div>
  </article>
}

function SectionHeading({ eyebrow, title, copy, align = 'left' }: { eyebrow: string; title: string; copy?: string; align?: 'left' | 'center' }) {
  return <div className={`section-heading align-${align}`}><span className="eyebrow"><i />{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}

function LocationsSection() {
  return <section className="locations-section"><div className="container locations-inner">
    <div className="locations-copy"><span className="eyebrow eyebrow-white"><i /> OUR SERVICE AREAS</span><h2>Serving local areas.</h2><p>We serve Lucknow, Saharanpur, Dehradun, Uttarakhand and Delhi. For large projects, contact us to discuss your needs.</p><Link className="locations-link" to="/contact#enquiry-form">Ask about your project <ArrowRight size={16}/></Link></div>
    <ul className="location-list">{business.serviceAreas.map((area, index) => <li key={area}><span className="location-number">0{index + 1}</span><MapPin size={17}/><b>{area}</b></li>)}</ul>
  </div></section>
}

function ProjectShowcaseCarousel() {
  const [active, setActive] = useState(projectPhotos.length - 1)
  const [transitionFrom, setTransitionFrom] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const project = projectPhotos[active]
  const changeTo = (index: number, nextDirection: 'next' | 'previous') => {
    if (index === active) return
    setDirection(nextDirection)
    setTransitionFrom(active)
    setActive(index)
  }
  const previous = () => changeTo((active - 1 + projectPhotos.length) % projectPhotos.length, 'previous')
  const next = () => changeTo((active + 1) % projectPhotos.length, 'next')

  useEffect(() => {
    if (transitionFrom === null) return
    const timer = window.setTimeout(() => setTransitionFrom(null), 750)
    return () => window.clearTimeout(timer)
  }, [transitionFrom])

  return <section className="project-preview-photo" aria-roledescription="carousel" aria-label="Completed fire safety installations">
    <div className="project-card-stack" aria-hidden="true">
      <span className="project-stack-card project-stack-left"><img src={projectPhotos[(active + projectPhotos.length - 1) % projectPhotos.length].image} alt="" /></span>
      <span className="project-stack-card project-stack-right"><img src={projectPhotos[(active + 1) % projectPhotos.length].image} alt="" /></span>
    </div>
    {transitionFrom !== null && <div className={`project-active-card project-active-card--outgoing-${direction}`} aria-hidden="true"><img src={projectPhotos[transitionFrom].image} alt=""/><span>COMPLETED INSTALLATION</span><b>{projectPhotos[transitionFrom].title}</b></div>}
    <Link className={`project-active-card project-active-card--front${transitionFrom !== null ? ` project-active-card--incoming-${direction}` : ''}`} to="/projects" aria-label={`View projects. Featured: ${project.title}`} onAnimationEnd={event => { if (event.animationName.startsWith('project-card-enter-')) setTransitionFrom(null) }}>
      <img src={project.image} alt={project.alt} loading="lazy" />
      <span>COMPLETED INSTALLATION</span>
      <b>{project.title}</b>
    </Link>
    <span className="project-slide-count" aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(projectPhotos.length).padStart(2, '0')}</span>
    <button className="project-slide-arrow project-slide-prev" type="button" aria-label="Previous project photo" onClick={previous}><ChevronLeft size={21} /></button>
    <button className="project-slide-arrow project-slide-next" type="button" aria-label="Next project photo" onClick={next}><ChevronRight size={21} /></button>
  </section>
}

function Home() {
  return <>
    <section className="hero"><div className="hero-image" /><div className="hero-shade" /><div className="container hero-inner">
      <div className="hero-copy"><span className="eyebrow eyebrow-white"><i /> INSTALLATION &amp; MAINTENANCE</span><h1>Fire safety for your building.</h1><p>Sprinklers, fire pipelines, alarms and safety equipment, installed and maintained.</p>
        <div className="hero-actions"><Link className="button button-red" to="/contact#enquiry-form">Get a quote <ArrowUpRight size={17} /></Link><a className="button button-outline" href={`tel:${business.phone}`}><Phone size={16} /> Call us</a></div>
        <ul className="hero-trust" aria-label="Service details"><li><b>{business.customersServed}</b><span>customers served</span></li><li><b>Careful work</b><span>Attention to products and installation</span></li><li><b>Serving</b><span>{business.serviceAreas.join(' · ')}</span></li></ul>
      </div>
      <div className="hero-note"><span>FIRE SAFETY INSTALLATION</span><span>Illustrative image</span></div>
      <a className="scroll-cue" href="#services"><ArrowDown size={16} /> See our services</a>
    </div><div className="hero-side-mark" aria-hidden="true">S G / 01</div></section>
    <section id="intro" className="intro section-pad"><div className="container intro-grid"><div><span className="eyebrow"><i /> ABOUT OUR WORK</span><h2>Fire safety starts with a conversation.</h2></div><div><p className="intro-copy">Tell us about your building. We’ll discuss the work and the next steps with you.</p><Link to="/about" className="text-link">About us <ArrowRight size={16} /></Link></div></div></section>
    <section className="trust-strip"><div className="container trust-grid"><div className="trust-stat"><strong>{business.customersServed}</strong><span>Customers served</span></div><div className="trust-item"><ShieldCheck /><div><b>Careful work</b><span>Attention to products and installation</span></div></div><div className="trust-item"><Flame /><div><b>Clear service</b><span>Speak directly with our team</span></div></div></div></section>
    <LocationsSection />
    <section id="services" className="services-section section-pad"><div className="container"><div className="section-row"><SectionHeading eyebrow="OUR SERVICES" title="Fire safety services" copy="See how we can help. Contact us about your site."/><Link className="text-link section-more" to="/services">All services <ArrowRight size={16} /></Link></div><div className="service-grid">{services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}</div></div></section>
    <section className="approach-section"><div className="container approach-grid"><div className="approach-photo"><img src="/images/fire-maintenance.webp" alt="Illustrative technician inspecting fire sprinkler pipework in a commercial building" loading="lazy" /><span>ILLUSTRATIVE IMAGE</span></div><div className="approach-content"><span className="eyebrow"><i /> WHY SHREE GANGA</span><h2>Practical help from our team.</h2><p>We listen to your needs, explain the next steps and stay in touch.</p><ul className="check-list"><li><Check /> Quality products</li><li><Check /> Careful installation</li><li><Check /> Clear communication</li><li><Check /> Customer satisfaction</li></ul><Link className="button button-dark" to="/about">About us <ArrowRight size={16} /></Link></div></div></section>
    <section className="leadership section-pad"><div className="container"><div className="section-row"><SectionHeading eyebrow="OUR TEAM" title="Meet our founders." copy="Speak with us about your project."/><Link className="text-link section-more" to="/about">About us <ArrowRight size={16} /></Link></div><div className="leader-grid"><div className="leader-card"><span className="leader-initial">RK</span><div><b>Ritik Kumar</b><small>Founder</small></div></div><div className="leader-card"><span className="leader-initial">AK</span><div><b>Ashish Kumar</b><small>Co-Founder</small></div></div><div className="leader-note"><p>We are growing through careful work and good customer service.</p></div></div></div></section>
    <section className="projects-preview"><div className="container projects-preview-inner"><div className="project-preview-copy"><span className="eyebrow eyebrow-white"><i /> OUR WORK</span><h2>Completed projects</h2><p>Photos from fire safety work completed by our team.</p><Link className="button button-light" to="/projects">See our projects <ArrowRight size={16} /></Link></div><ProjectShowcaseCarousel /></div></section>
    <section className="closing-cta"><div className="container closing-inner"><div><span className="eyebrow"><i /> CONTACT US</span><h2>Need fire safety work?</h2><p>Tell us about your project. We’ll get back to you.</p></div><Link className="button button-red" to="/contact#enquiry-form">Get a quote <ArrowUpRight size={17} /></Link></div></section>
  </>
}

function PageIntro({ eyebrow, title, copy, className = '' }: { eyebrow: string; title: string; copy: string; className?: string }) {
  return <section className={`page-intro ${className}`.trim()}><div className="container"><span className="eyebrow"><i />{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></section>
}

function About() {
  return <><PageIntro eyebrow="ABOUT US" title="Fire safety, with care." copy="We install fire safety systems and equipment. We focus on good products, careful work and clear communication." />
    <section className="about-content section-pad"><div className="container about-grid"><div className="about-lead"><span className="eyebrow"><i /> OUR COMPANY</span><h2>A growing fire safety team.</h2><p>We have served 12 customers. Their appreciation encourages us to keep improving.</p><p>We listen, discuss the work and agree on the next steps with you.</p></div><div className="about-image"><img src="/images/fire-sprinkler.webp" alt="Illustrative fire sprinkler equipment" /><span>ILLUSTRATIVE IMAGE</span></div></div></section>
    <section className="values-section section-pad"><div className="container"><SectionHeading eyebrow="OUR VALUES" title="How we work."/><div className="mission-grid"><article><span>OUR MISSION</span><p>Help customers find fire safety products and installation services for their needs.</p></article><article><span>OUR VISION</span><p>Grow through good work, clear service and lasting customer relationships.</p></article></div><div className="value-grid"><article><span>01</span><h3>Good products</h3><p>We pay attention to the products we use.</p></article><article><span>02</span><h3>Careful work</h3><p>We aim to do each job with care.</p></article><article><span>03</span><h3>Clear plans</h3><p>We discuss your site and needs before work begins.</p></article></div></div></section>
    <section className="leaders-section section-pad"><div className="container"><SectionHeading eyebrow="LEADERSHIP" title="Meet our founders." copy="Call us to talk about your project."/><div className="founders-grid"><div className="founder-card"><span>RK</span><div><small>FOUNDER</small><h3>Ritik Kumar</h3><a href={`tel:${business.phone}`}><Phone size={15}/> {business.phone}</a></div></div><div className="founder-card"><span>AK</span><div><small>CO-FOUNDER</small><h3>Ashish Kumar</h3><a href={`tel:${business.alternatePhone}`}><Phone size={15}/> {business.alternatePhone}</a></div></div></div></div></section>
    <Callout />
  </>
}

function Services() { return <><PageIntro eyebrow="OUR SERVICES" title="Fire safety services." copy="Choose a service to learn more or get a quote." className="services-page-intro"/><section className="services-section services-list-section section-pad"><div className="container"><div className="service-grid service-grid-page">{services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i}/>)}</div><p className="service-area-note"><MapPin size={15}/> Serving Lucknow, Saharanpur, Dehradun, Uttarakhand and Delhi.</p></div></section><Callout/></> }

function ServiceDetail() {
  const { slug } = useParams(); const service = services.find(s => s.slug === slug)
  if (!service) return <NotFound />
  return <><PageIntro eyebrow="SERVICE" title={service.title} copy={service.description}/><section className="service-detail section-pad"><div className="container detail-grid"><div className="detail-image"><img src={service.image} alt={service.imageAlt} /><span>ILLUSTRATIVE IMAGE</span></div><div><span className="eyebrow"><i /> HOW IT WORKS</span><h2>Let’s discuss your site.</h2><p>We’ll discuss your building and the scope of work with you.</p><h3>Common uses</h3><ul className="check-list">{service.applications.map(x=><li key={x}><Check/>{x}</li>)}</ul><p className="detail-note">Ask us to confirm service availability for your location.</p><Link className="button button-red" to={`/contact?service=${service.slug}#enquiry-form`}>Get a quote <ArrowUpRight size={16}/></Link></div></div></section><section className="related-services section-pad"><div className="container"><SectionHeading eyebrow="MORE SERVICES" title="Other services"/><div className="service-grid">{services.filter(s=>s.slug!==service.slug).slice(0,3).map((s,i)=><ServiceCard key={s.slug} service={s} index={i+1}/>)}</div></div></section></>
}

function Projects() { return <><PageIntro eyebrow="PROJECTS" title="Completed projects." copy="Photos of fire hose reels, pipelines, pumps and other fire safety work." className="projects-page-intro"/><section className="project-gallery-section section-pad"><div className="container"><div className="project-gallery-intro"><span className="eyebrow"><i/> OUR WORK</span><p>Want similar work at your site? Contact us to discuss your project.</p></div><div className="project-gallery">{projectPhotos.map((project, index) => <figure className="project-photo-card" key={project.image}><div className="project-photo-frame"><img src={project.image} alt={project.alt} loading={index < 2 ? 'eager' : 'lazy'} decoding="async"/><span>{project.category}</span></div><figcaption><small>INSTALLATION {String(index + 1).padStart(2, '0')}</small><h2>{project.title}</h2></figcaption></figure>)}</div></div></section><Callout/></> }

function Testimonials() {
  return <><PageIntro eyebrow="CUSTOMER RATINGS" title="Ratings from our customers." copy="These customers rated our work at their sites." className="reviews-page-intro"/><section className="review-section section-pad"><div className="container"><div className="review-summary"><p>Customer ratings</p><span>{customerRatings.length} ratings</span></div><div className="review-grid">{customerRatings.map(review => {
    const fullStars = Math.floor(review.rating)
    const halfStar = review.rating % 1 >= 0.5
    return <article className="review-card" key={`${review.venue}-${review.customer}`}>
      <div className="review-card-top">
        <h2>{review.venue}</h2>
        <div className="review-rating" role="img" aria-label={`${review.rating} out of 5 stars`}><span className="review-stars" aria-hidden="true">{ratingStarKeys.map((starKey, index) => {
        const isFull = index < fullStars
        const isHalf = index === fullStars && halfStar
        const Icon = isHalf ? StarHalf : Star
        return <Icon key={`${review.venue}-${starKey}`} size={18} strokeWidth={1.6} fill={isFull || isHalf ? 'currentColor' : 'none'} />
        })}</span><b>{review.rating}/5</b></div>
      </div>
      {review.location && <p className="review-location"><MapPin size={14}/>{review.location}</p>}
      <div className="review-card-feedback"><small>FEEDBACK POINT</small><p>{review.feedback.before}<strong>{review.feedback.highlight}</strong>{review.feedback.after}</p></div>
      <div className="review-customer"><small>RATED BY</small><b>{review.customer}</b></div>
    </article>
  })}</div></div></section><Callout/></>
}

function ServiceDropdown({ value, onChange, invalid, triggerRef }: { value: string; onChange: (value: string) => void; invalid: boolean; triggerRef: RefObject<HTMLDivElement> }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(Math.max(0, serviceOptions.findIndex(option => option.value === value)))
  const [opensAbove, setOpensAbove] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedIndex = serviceOptions.findIndex(option => option.value === value)
  const selectedLabel = serviceOptions[selectedIndex]?.label || 'Choose a service'

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  function showOptions(index = Math.max(0, selectedIndex)) {
    const bounds = triggerRef.current?.getBoundingClientRect()
    setOpensAbove(Boolean(bounds && window.innerHeight - bounds.bottom < 280))
    setActiveIndex(index)
    setOpen(true)
  }

  function choose(index: number) {
    onChange(serviceOptions[index].value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        showOptions(event.key === 'ArrowDown' ? Math.max(0, selectedIndex) : selectedIndex < 0 ? serviceOptions.length - 1 : selectedIndex)
        return
      }
      setActiveIndex(index => (index + (event.key === 'ArrowDown' ? 1 : serviceOptions.length - 1)) % serviceOptions.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      if (!open) showOptions(event.key === 'Home' ? 0 : serviceOptions.length - 1)
      else setActiveIndex(event.key === 'Home' ? 0 : serviceOptions.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(activeIndex)
      else showOptions()
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    }
  }

  return <div className="service-dropdown" ref={rootRef}>
    <div
      ref={triggerRef}
      id="service-combobox"
      className="service-dropdown-trigger"
      role="combobox"
      tabIndex={0}
      aria-labelledby="service-label"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls="service-options"
      aria-activedescendant={open ? `service-option-${activeIndex}` : undefined}
      aria-required="true"
      aria-invalid={invalid}
      aria-describedby={invalid ? 'service-error' : undefined}
      onClick={() => open ? setOpen(false) : showOptions()}
      onKeyDown={handleKeyDown}
      onBlur={event => { if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false) }}
    >
      <span className={selectedIndex < 0 ? 'service-dropdown-placeholder' : undefined}>{selectedLabel}</span>
      <ChevronDown size={18} aria-hidden="true" />
    </div>
    {open && <div id="service-options" className={`service-dropdown-options${opensAbove ? ' options-above' : ''}`} role="listbox" aria-labelledby="service-label">
      {serviceOptions.map((option, index) => <button
        id={`service-option-${index}`}
        className={`service-dropdown-option${index === activeIndex ? ' is-active' : ''}${value === option.value ? ' is-selected' : ''}`}
        key={option.value}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={value === option.value}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseDown={event => event.preventDefault()}
        onClick={() => choose(index)}
      >{option.label}{value === option.value && <Check size={16} aria-hidden="true" />}</button>)}
    </div>}
    {invalid && <span id="service-error" className="service-dropdown-error" role="alert">Choose a service to continue.</span>}
  </div>
}

function EnquiryForm() {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const [service, setService] = useState(params.get('service') || '')
  const [serviceInvalid, setServiceInvalid] = useState(false)
  const serviceTriggerRef = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false); const [messageUrl, setMessageUrl] = useState('')
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!service) {
      setServiceInvalid(true)
      serviceTriggerRef.current?.focus()
      return
    }
    if (!form.reportValidity()) return
    const data = new FormData(form)
    if (String(data.get('website') || '').trim()) return
    const body = [
      'Hello SHREE GANGA FIRE & SAFETY, I would like to enquire about a service.',
      `Name: ${String(data.get('name')).trim()}`, `Phone: ${String(data.get('phone')).trim()}`, `Service: ${service ? services.find(s=>s.slug===service)?.title || 'Others...' : 'Not selected'}`,
      `Project location: ${String(data.get('location')).trim()}`,
      `Requirements: ${String(data.get('details')).trim()}`,
    ]
    const email = String(data.get('email') || '').trim()
    if (email) body.push(`Email: ${email}`)
    setMessageUrl(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(body.join('\n'))}`)
    setSent(true)
  }
  if (sent) return <div className="form-success" role="status"><span><Check/></span><h3>Your message is ready.</h3><p>WhatsApp will open so you can review and send it.</p><a className="button button-red" href={messageUrl} target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={16}/></a><button type="button" className="text-button" onClick={()=>setSent(false)}>Change details</button></div>
  return <form className="enquiry-form" onSubmit={submit}>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input tabIndex={-1} autoComplete="off" id="website" name="website" /></div>
    <label><span className="field-label">Name <i aria-hidden="true">*</i></span><input name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required /></label>
    <div className="form-row"><label><span className="field-label">Phone <i aria-hidden="true">*</i></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[+0-9() .-]{8,20}" title="Enter a valid phone number." maxLength={20} required /></label><label><span className="field-label">Email <small>(optional)</small></span><input name="email" type="email" autoComplete="email" maxLength={254} /></label></div>
    <div className="enquiry-service-field"><span id="service-label" className="field-label">Service <i aria-hidden="true">*</i></span><ServiceDropdown value={service} onChange={value => { setService(value); setServiceInvalid(false) }} invalid={serviceInvalid} triggerRef={serviceTriggerRef} /></div>
    <label><span className="field-label">City or area <i aria-hidden="true">*</i></span><input name="location" type="text" autoComplete="address-level2" maxLength={120} placeholder="Where is the project?" required /></label>
    <label><span className="field-label">How can we help? <i aria-hidden="true">*</i></span><textarea name="details" rows={4} minLength={10} maxLength={1500} placeholder="Describe the service or project you need." required /></label>
    <p className="form-privacy">We only send your details to WhatsApp if you choose to send the message. This website does not store this form.</p>
    <button className="button button-red form-submit" type="submit">Continue to WhatsApp <ArrowUpRight size={16}/></button>
  </form>
}

function Contact() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  return <><PageIntro eyebrow="CONTACT" title="Contact us." copy="Tell us about your project using the form below, or call us directly." className="contact-page-intro"/><section className="contact-section contact-page-section section-pad"><div className="container contact-grid"><div className="contact-info"><span className="eyebrow"><i/> GET IN TOUCH</span><h2>Choose how to reach us.</h2><p>Call, email or send us a message on WhatsApp.</p><div className="contact-person"><span>RK</span><div><b>Ritik Kumar</b><small>Founder</small><a href={`tel:${business.phone}`}>{business.phone}</a></div><a className="round-link" href={`tel:${business.phone}`} aria-label="Call Ritik Kumar"><Phone size={17}/></a></div><div className="contact-person"><span>AK</span><div><b>Ashish Kumar</b><small>Co-Founder</small><a href={`tel:${business.alternatePhone}`}>{business.alternatePhone}</a></div><a className="round-link" href={`tel:${business.alternatePhone}`} aria-label="Call Ashish Kumar"><Phone size={17}/></a></div><a className="contact-email" href={`mailto:${business.email}`}><span className="gmail-mark"><svg viewBox="0 0 48 48" role="img" aria-label="Gmail"><path fill="#4285F4" d="M5 13.5 11.5 18v22H8.8A3.8 3.8 0 0 1 5 36.2z"/><path fill="#34A853" d="M36.5 18 43 13.5v22.7a3.8 3.8 0 0 1-3.8 3.8h-2.7z"/><path fill="#FBBC04" d="M5 13.5 11.5 18v22H8.8A3.8 3.8 0 0 1 5 36.2z"/><path fill="#EA4335" d="M5.8 10.7a3.8 3.8 0 0 1 4.7-.2L24 20.8l13.5-10.3a3.8 3.8 0 0 1 4.7.2L24 29.2z"/><path fill="#C5221F" d="M36.5 18 43 13.5v22.7a3.8 3.8 0 0 1-3.8 3.8h-2.7z"/></svg></span><div><small>EMAIL</small><b>{business.email}</b></div></a><a className="contact-whatsapp" href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hello ${business.name}, I would like to discuss ${params.get('service') ? services.find(s=>s.slug===params.get('service'))?.title || 'another fire safety service' : 'a fire safety project'}.`)}`} target="_blank" rel="noreferrer">Message us on WhatsApp <ArrowUpRight size={16}/></a><div className="contact-areas"><span className="eyebrow"><i/> CURRENT SERVICE AREAS</span><p>{business.serviceAreas.join(' · ')}</p><small>Contact us about other locations.</small></div></div><div id="enquiry-form" className="contact-form-wrap" tabIndex={-1}><div className="form-heading"><span className="eyebrow"><i/> QUICK ENQUIRY</span><h2>Get a quote.</h2><p>Fields with * are required.</p></div><EnquiryForm/></div></div></section></>
}

function Legal({ type }: { type: 'privacy' | 'terms' }) {
  return <><PageIntro eyebrow="INFORMATION" title={type === 'privacy' ? 'Privacy policy' : 'Terms and conditions'} copy={`${business.name} website information.`}/><section className="legal-content section-pad"><div className="container legal-inner">{type === 'privacy' ? <><h2>Your details</h2><p>This form prepares a WhatsApp message from the details you enter. Nothing is sent until you choose WhatsApp and send it. This website does not store form entries.</p><h2>Other services</h2><p>WhatsApp’s privacy policy applies when you use WhatsApp. Phone and email links open apps on your device. This site does not use advertising or analytics trackers.</p><h2>Contact</h2><p>For privacy questions, email <a href={`mailto:${business.email}`}>{business.email}</a>.</p></> : <><h2>Website information</h2><p>This site shares general information about our fire safety services. We will discuss the work, cost and availability for each project before agreeing to it.</p><h2>Safety and compliance</h2><p>This website does not promise a technical result or regulatory approval. Ask a qualified professional about your building’s safety requirements.</p><h2>Service areas</h2><p>Contact us to check service availability in your area. Website information may change as our business grows.</p><h2>Contact</h2><p>Call <a href={`tel:${business.phone}`}>{business.phone}</a> or email <a href={`mailto:${business.email}`}>{business.email}</a>.</p></>}</div></section></>
}

function Callout() { return <section className="closing-cta"><div className="container closing-inner"><div><span className="eyebrow"><i/> CONTACT US</span><h2>Need fire safety work?</h2><p>Tell us about your project. We’ll get back to you.</p></div><Link className="button button-red" to="/contact#enquiry-form">Get a quote <ArrowUpRight size={17}/></Link></div></section> }
function NotFound() { return <PageIntro eyebrow="PAGE NOT FOUND" title="Page not found." copy="Go to the home page or contact us."/> }

export default function App() {
  const location = useLocation()
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to the top after route navigation.
  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        target?.scrollIntoView()
        target?.focus({ preventScroll: true })
      })
    } else window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
  return <><Metadata/><Header/><main key={`${location.pathname}${location.search}`} className="page-transition"><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceDetail/>}/><Route path="/projects" element={<Projects/>}/><Route path="/reviews" element={<Testimonials/>}/><Route path="/testimonials" element={<Navigate to="/reviews" replace/>}/><Route path="/contact" element={<Contact/>}/><Route path="/privacy" element={<Legal type="privacy"/>}/><Route path="/terms" element={<Legal type="terms"/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer/><WhatsAppFloat/><div className="mobile-contact"><a href={`tel:${business.phone}`}><Phone size={16}/> Call</a><a href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Hello, I would like to ask about fire safety work.')}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><Link to="/contact#enquiry-form">Get a quote <ArrowUpRight size={15}/></Link></div><button type="button" className="back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top"><ChevronDown size={16}/></button></>
}
