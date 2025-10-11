export interface ProjectItem {
  title: string;
  description: string;
  liveLink: string;
  githubLink: string | null;
  category: 'startup' | 'silly';
}

export const projectsData: ProjectItem[] = [
  {
    title: 'Onni Clinics',
    description:
      'Fertility clinics search for Onni Care. Find the nearest clinic and book an appointment.',
    liveLink: 'https://app.onni-care.de/',
    githubLink: null,
    category: 'startup',
  },
  {
    title: 'Urbanwrap',
    description: 'Your personal sports year in review — like Spotify Wrapped but for Urban Sports!',
    liveLink: 'https://urbanwrap.raspberry.blue/',
    githubLink: 'https://github.com/opeixenada/urbanwrap',
    category: 'silly',
  },
  {
    title: 'Censordle',
    description: 'Game where you guess movies based on their parental guide entries from IMDB.',
    liveLink: 'https://censordle.raspberry.blue/',
    githubLink: 'https://github.com/opeixenada/censordle',
    category: 'silly',
  },
];
