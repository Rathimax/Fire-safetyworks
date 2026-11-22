export const business = {
  name: 'SHREE GANGA FIRE & SAFETY',
  shortName: 'Shree Ganga',
  founder: 'Ritik Kumar',
  coFounder: 'Ashish Kumar',
  phone: '8218442193',
  alternatePhone: '7310606033',
  email: 'shreegangafiresafety@gmail.com',
  whatsapp: '918218442193',
  customersServed: 12,
  serviceAreas: ['Lucknow', 'Saharanpur', 'Dehradun', 'Uttarakhand', 'Delhi'],
  siteUrl: (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, ''),
  description: 'Fire safety installation and equipment, with careful work and clear communication.',
} as const

export type Service = {
  slug: string
  title: string
  short: string
  description: string
  image: string
  imageAlt: string
  applications: string[]
  icon: 'sprinkler' | 'pipeline' | 'equipment' | 'alarm' | 'maintenance'
}

export const services: Service[] = [
  { slug: 'fire-sprinkler-installation', title: 'Fire Sprinkler Installation', short: 'Sprinkler installation for suitable buildings.', description: 'We install fire sprinkler systems for suitable buildings. We discuss your site and project before work begins.', image: '/images/fire-sprinkler.webp', imageAlt: 'Illustrative fire sprinkler head and red pipework in a commercial ceiling', applications: ['Commercial buildings', 'Factories', 'Other suitable buildings'], icon: 'sprinkler' },
  { slug: 'firefighting-water-pipeline', title: 'Firefighting Water Pipeline', short: 'Firefighting water pipeline installation.', description: 'We install firefighting water pipelines based on your site and project needs.', image: '/images/fire-pipeline.webp', imageAlt: 'Illustrative red firefighting water pipeline and valves in an industrial plant room', applications: ['New buildings', 'Building upgrades', 'Other suitable sites'], icon: 'pipeline' },
  { slug: 'fire-extinguishers-equipment', title: 'Fire Extinguishers & Equipment', short: 'Fire extinguishers and related safety equipment.', description: 'We can supply and install fire extinguishers and other fire safety equipment, based on the products and work needed.', image: '/images/fire-extinguisher.webp', imageAlt: 'Illustrative red portable fire extinguisher mounted in a commercial corridor', applications: ['Workplaces', 'Shops and offices', 'Other suitable buildings'], icon: 'equipment' },
  { slug: 'fire-alarm-systems', title: 'Fire Alarm Systems', short: 'Fire alarm systems and related parts.', description: 'We install fire alarm systems and related parts based on your building and needs.', image: '/images/fire-alarm.webp', imageAlt: 'Illustrative fire alarm and call point installed in a modern commercial interior', applications: ['Commercial buildings', 'Factories', 'Other suitable buildings'], icon: 'alarm' },
  { slug: 'fire-safety-maintenance', title: 'Fire Safety Maintenance', short: 'Maintenance and inspections for supported systems.', description: 'We maintain and inspect fire safety systems supported by our team. Contact us to check if we can help with your equipment.', image: '/images/fire-maintenance.webp', imageAlt: 'Illustrative technician inspecting sprinkler pipework in a commercial building', applications: ['Existing systems', 'Equipment checks', 'Planned maintenance'], icon: 'maintenance' },
]

export type ProjectPhoto = {
  image: string
  alt: string
  title: string
  category: string
}

export const projectPhotos: ProjectPhoto[] = [
  { image: '/images/projects/fire-safety-equipment.webp', alt: 'Wall-mounted red fire hose reel and fire hose cabinet in an indoor facility', title: 'Indoor fire hose reel and cabinet', category: 'Firefighting equipment' },
  { image: '/images/projects/building-entrance-system.webp', alt: 'Red fire hose reel, cabinet and firefighting pipework beside a building entrance', title: 'Building entrance fire safety system', category: 'Hose reel & pipework' },
  { image: '/images/projects/outdoor-hose-reel.webp', alt: 'Outdoor fire hose reel and red riser connected to a pipeline in a landscaped area', title: 'Outdoor hose reel installation', category: 'Hose reel & pipework' },
  { image: '/images/projects/indoor-hose-reel.webp', alt: 'Red indoor fire hose reel connected to a horizontal firefighting pipe and valve', title: 'Indoor hose reel and pipework', category: 'Hose reel & pipework' },
  { image: '/images/projects/outdoor-hose-reel-pipeline.webp', alt: 'Outdoor red fire hose reel riser with a firefighting pipeline running underground', title: 'Outdoor reel and pipeline connection', category: 'Hose reel & pipework' },
  { image: '/images/projects/trench-pipeline-installation.webp', alt: 'Firefighting pipeline laid through an open trench beside a landscaped walkway', title: 'Firefighting pipeline installation', category: 'Pipeline installation' },
  { image: '/images/projects/fire-pump-water-tank.webp', alt: 'Red fire pump and pipework connected to a ribbed water storage tank', title: 'Fire pump and water storage', category: 'Pump & water storage' },
]

export type CustomerRating = {
  venue: string
  customer: string
  rating: number
  location?: string
  feedback: {
    before: string
    highlight: string
    after: string
  }
}

export const customerRatings: CustomerRating[] = [
  { venue: 'Ashirwad Resort', customer: 'Ramnivas', rating: 4.5, location: 'Baghpat', feedback: { before: 'Noted the ', highlight: 'fair, affordable price', after: ' for the work.' } },
  { venue: 'Sarita Garden', customer: 'Denash Chauhan', rating: 4.5, location: 'Baghpat', feedback: { before: 'Was happy with the ', highlight: 'quality of the work', after: ' and its neat finish.' } },
  { venue: 'Eicher Agency', customer: 'Mukesh Goel', rating: 5, location: 'Delhi', feedback: { before: 'Appreciated the ', highlight: 'good-quality fittings', after: ' used in the installation.' } },
  { venue: 'Kusum Banquet', customer: 'Ashish Rathi', rating: 5, location: 'Janshat Road', feedback: { before: 'Was pleased with the ', highlight: 'neat finishing', after: ' of the completed work.' } },
  { venue: 'Pyare Lal Mandap', customer: 'Navneet Sharma', rating: 4, location: 'Delhi', feedback: { before: 'Valued that the work was ', highlight: 'completed on time', after: '.' } },
  { venue: 'DAV Hospital', customer: 'Rakhi', rating: 5, location: 'Lucknow', feedback: { before: 'Appreciated the ', highlight: 'quality workmanship', after: ' and good fittings.' } },
  { venue: 'Chauhan Banquet', customer: 'Kuldeep Chauhan', rating: 4.5, location: 'Delhi', feedback: { before: 'Found the pricing ', highlight: 'reasonable and affordable', after: ' for the project.' } },
  { venue: 'The Elite Hotel', customer: 'Vipin Nain', rating: 5, location: 'Lucknow', feedback: { before: 'Liked the ', highlight: 'quality fittings', after: ' and clean finish.' } },
  { venue: 'Jyoti Nursing', customer: 'Mohd Azam', rating: 4, location: 'Lucknow', feedback: { before: 'Recognised the ', highlight: 'on-time completion', after: ' and quality of the work.' } },
]

export const navLinks = [
  { label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Services', to: '/services' }, { label: 'Projects', to: '/projects' }, { label: 'Reviews', to: '/reviews' },
]
