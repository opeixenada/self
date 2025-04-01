export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  liveLink: string;
  githubLink: string | null;
  category: 'startup' | 'silly';
}

export const projectsData: ProjectItem[] = [
  {
    title: 'Onni Clinics',
    description:
      'Fertility clinics search for Onni Care. Find the nearest clinic and book an appointment.',
    image: '/src/assets/projects/Onni-Care.png',
    liveLink: 'https://app.onni-care.de/',
    githubLink: null,
    category: 'startup',
  },
  {
    title: 'Yourequal',
    description: 'Community-led employer-rating platform for marginalised workers.',
    image: '/src/assets/projects/Yourequal.png',
    liveLink: 'https://yourequal.space/',
    githubLink: null,
    category: 'startup',
  },
  {
    title: 'Urbanwrap',
    description: 'Your personal sports year in review — like Spotify Wrapped but for Urban Sports!',
    image: '/src/assets/projects/UrbanWrap.png',
    liveLink: 'https://urbanwrap.raspberry.blue/',
    githubLink: 'https://github.com/opeixenada/urbanwrap',
    category: 'silly',
  },
  {
    title: 'Censordle',
    description: 'Game where you guess movies based on their parental guide entries from IMDB.',
    image: '/src/assets/projects/Censordle.png',
    liveLink: 'https://censordle.raspberry.blue/',
    githubLink: 'https://github.com/opeixenada/censordle',
    category: 'silly',
  },
];
