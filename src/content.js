// ─────────────────────────────────────────────────────────────
//  Edit this file to make the portfolio yours.
// ─────────────────────────────────────────────────────────────
import { mdiGithub, mdiLinkedin, mdiEmail } from '@mdi/js';

export const NAME = 'Dayna Briffa';
export const TAGLINE = 'Software Developer · Problem Solver';

// Icons come from Material Design Icons (https://pictogrammers.com/library/mdi/).
// Import the ones you need, e.g. mdiWeb, mdiInstagram, mdiYoutube.
export const SOCIALS = [
  { icon: mdiGithub, label: 'GitHub', url: 'https://github.com/your-handle' },
  { icon: mdiLinkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle' },
  { icon: mdiEmail, label: 'Email', url: 'mailto:you@example.com' },
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
  color: '#f4a261',
};

// One building per project.
//   buildingType: 'tower' | 'factory' | 'dome' | 'house' | 'cottage' | 'construction'
//   status (optional): 'construction' for work-in-progress projects
//   model (optional): GLB filename in /public/models to replace the placeholder
export const PROJECTS = [
  {
    title: 'Interactive Order Forms',
    problem: 'Retail store staff had to order highly configurable bathroom products through slow, manual order forms that required knowing exact ranges and SKUs. This was error-prone and routinely produced incomplete or physically unbuildable configurations that reached the factory and had to be chased up and corrected.',
    solution: 'Interactive Order Forms is a multi-tenant web app that guides store staff through building only valid, manufacturable orders via a rule-enforcing cascading picker. On submission it groups the order into per-category PDFs, emails shareable links, and feeds finalised orders into the fulfilment pipeline.',
    tech: ['C#', '.NET', 'Vue.js', 'MongoDB', 'AWS EC2', 'AWS S3'],
    links: [{ label: 'View site', url: 'https://forms.adpaustralia.com.au' }],
    buildingType: 'factory',
    color: '#e76f51',
  },
  {
    title: 'CNC Program Automation',
    problem: 'Placeholder problem statement.',
    solution: 'Placeholder solution summary.',
    tech: ['C#', 'Windows Service'],
    links: [],
    buildingType: 'tower',
    color: '#2a9d8f',
  },
  {
    title: 'Internal Dashboard',
    problem: 'Placeholder problem statement.',
    solution: 'Placeholder solution summary.',
    tech: ['Vue', 'ASP.NET Core'],
    links: [],
    buildingType: 'dome',
    color: '#8ab4f8',
  },
  {
    title: 'Another Win',
    problem: 'Placeholder problem statement.',
    solution: 'Placeholder solution summary.',
    tech: ['Docker', 'Ubuntu'],
    links: [],
    buildingType: 'house',
    color: '#c77dff',
  },
  {
    // status: 'construction' shows an "Under construction" badge and
    // relabels the sections "The idea" / "Progress so far".
    status: 'construction',
    title: 'Personal Project',
    problem: 'What are you building, and why? Describe the idea or the problem it tackles.',
    solution: 'Where it is at so far, and what is coming next.',
    tech: ['TBD'],
    links: [],
    buildingType: 'construction',
    color: '#457b9d',
  },
];
