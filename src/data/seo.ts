import { business, services } from './business'

export const publicRoutes = [
  '/', '/about', '/services', ...services.map(service => `/services/${service.slug}`),
  '/projects', '/reviews', '/contact', '/privacy', '/terms',
]
export const siteOrigin = business.siteUrl

const pageTitles: Record<string, string> = {
  '/': 'Fire Safety Installation Services',
  '/about': 'About Our Fire Safety Team',
  '/services': 'Fire Protection Services',
  '/projects': 'Fire Safety Installation Projects',
  '/reviews': 'Customer Ratings',
  '/contact': 'Contact Our Fire Safety Team',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms and Conditions',
}

const pageDescriptions: Record<string, string> = {
  '/': `Fire sprinkler, alarm, firefighting pipeline and equipment installation by ${business.name}. Contact us about work in ${business.serviceAreas.join(', ')}.`,
  '/about': `Meet the founders and learn about the fire safety installation and equipment services offered by ${business.name}.`,
  '/services': `Explore fire sprinkler, firefighting pipeline, extinguisher, alarm and maintenance services from ${business.name}.`,
  '/projects': `View photos of firefighting pipeline, hose reel, pump and fire safety equipment installations completed by ${business.name}.`,
  '/reviews': `Read customer ratings for fire safety installation work by ${business.name}.`,
  '/contact': `Contact ${business.name} by phone, email or WhatsApp about fire safety installation and equipment.`,
  '/privacy': `Learn how ${business.name} handles information entered in its website enquiry form.`,
  '/terms': `Read the terms for using the ${business.name} website and information about its services.`,
}

export function getSeoMetadata(pathname: string) {
  const service = services.find(item => pathname === `/services/${item.slug}`)
  const title = pageTitles[pathname] || (service ? `${service.title} Services` : 'Page Not Found')
  const description = pageDescriptions[pathname] || (service
    ? `${service.description} Contact ${business.name} about this service in ${business.serviceAreas.join(', ')}.`
    : `Fire safety installation and equipment from ${business.name}.`)
  return { title: `${title} | ${business.name}`, description, service }
}

export function getStructuredData(pathname: string) {
  const { description, service } = getSeoMetadata(pathname)
  return service ? {
    '@context': 'https://schema.org', '@type': 'Service', name: service.title,
    description, serviceType: service.title, areaServed: business.serviceAreas,
    provider: { '@type': 'Organization', name: business.name, telephone: business.phone, email: business.email, ...(business.siteUrl ? { url: business.siteUrl } : {}) },
  } : {
    '@context': 'https://schema.org', '@type': 'Organization', name: business.name,
    description: business.description, email: business.email,
    areaServed: business.serviceAreas, telephone: business.phone,
    contactPoint: [{ '@type': 'ContactPoint', telephone: business.phone, contactType: 'customer service' }],
    ...(business.siteUrl ? { url: business.siteUrl } : {}),
  }
}
