// ─────────────────────────────────────────────────────────────
//  Edit this file to make the portfolio yours.
// ─────────────────────────────────────────────────────────────
import { mdiGithub, mdiLinkedin, mdiEmail } from '@mdi/js';

export const NAME = 'Dayna Briffa';
export const TAGLINE = 'Full Stack Software Engineer';

export const SOCIALS = [
  { icon: mdiGithub, label: 'GitHub', url: 'https://github.com/DayBri' },
  { icon: mdiLinkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/daybreee/' },
  { icon: mdiEmail, label: 'Email', url: 'daybreee@gmail.com' },
];

// Optional: drop a GLB into /public/models and name it here, e.g. 'character.glb'.
// If it has animation clips named like "Walk" / "Idle" they will be used.
export const CHARACTER_MODEL = null;

// The first stop is the welcome / about stop.
export const ABOUT = {
  title: 'Welcome!',
  kicker: 'About me',
  body: [
    'Hi, I build software that solves real-world problems. Walk around my little world to see a few of them.',
    'Use the arrow keys, the buttons below, or click any building to travel there.',
  ],
  buildingType: 'cottage',
  color: '#d87278',
};

export const PROJECTS = [
  {
    title: 'Interactive Order Forms',
    problem: 'Retail store staff had to order highly configurable bathroom products through slow, manual order forms that required knowing exact ranges and SKUs. This was error-prone and routinely produced incomplete or physically unbuildable configurations that reached the factory and had to be chased up and corrected.',
    solution: 'Interactive Order Forms is a multi-tenant web app that guides store staff through building only valid, manufacturable orders via a rule-enforcing cascading picker. On submission it groups the order into per-category PDFs, emails shareable links, and feeds finalised orders into the fulfilment pipeline.',
    tech: ['C#', '.NET', 'Vue.js', 'MongoDB', 'AWS EC2', 'AWS S3'],
    links: [{ label: 'View site', url: 'https://forms.adpaustralia.com.au' }],
    buildingType: 'factory',
    color: '#e79551',
  },
  {
    title: 'CAD Manufacturing Automation',
    problem: 'Every bathroom unit previously required manual CAD modelling in Cabinet Vision before nesting, creating a significant production bottleneck and increasing manufacturing lead times.',
    solution: 'Developed a C#/.NET 6 command-line application that automatically generates native Cabinet Vision .ordx job files directly from customer orders, integrating SQL Server and PostgreSQL databases, parsing ERP order data, and generating templated XML based on SKU and configuration rules.',
    tech: ['C#', '.NET 6', 'XML', 'JSON', 'SQL', 'Cabinet Vision'],
    links: [],
    buildingType: 'tower',
    color: '#8acf75',
  },
  {
    title: 'Sales Entry Software',
    problem: 'The existing ERP order-entry process was inefficient, prone to human error, and lacked robust product configuration validation, order tracking, and bulk-order functionality, resulting in slower processing and avoidable factory interruptions.',
    solution: 'Designed and developed a custom internal sales and order-entry platform driven by a bespoke Product Information Management (PIM) system, enforcing valid product configurations, automating bulk order entry, improving order traceability, and achieving 60% faster load times compared to the legacy ERP system.', 
    tech: ['Vue.js', 'Vuetify.js', 'JavaScript', 'C#', '.Net 6', 'SQL', 'IIS'],
    links: [],
    buildingType: 'dome',
    color: '#8ab4f8',
  },
  {
    title: 'White Label Business Model Integration',
    problem: 'The B2B ordering platform, product catalogue, and documentation were hardwired to a single brand, limiting reseller and wholesale opportunities while creating reliance on manual workarounds and duplicated data.',
    solution: 'Designed and integrated a multi-tenant white-labelling architecture, enabling multiple brands and buying groups to use the same centralised product catalogue and configuration engine with customised branding, pricing, and manufacturing outputs.',
    tech: ['Vue.js', 'JavaScript', 'C#', 'SQL', '.Net 6', 'IIS'],
    links: [],
    buildingType: 'house',
    color: '#ffd67d',
  },
  {
    // status: 'construction' shows an "Under construction" badge and
    // relabels the sections "The idea" / "Progress so far".
    status: 'construction',
    title: 'Distew (Idle Game) - Personal Project',
    solution: 'Developing an Idle game inspired by Melvor Idle, Clash of Clans and Minecraft mod \'Minecolonies\'',
    tech: ['Vue.js', 'JavaScript', 'HTML', 'CSS'],
    links: [],
    buildingType: 'construction',
    color: '#7d459d',
  },
];
