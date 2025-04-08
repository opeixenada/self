import React from 'react';
import ProjectCard from './ProjectCard.tsx';
import Section from '../Section.tsx';
import { projectsData } from '../../data/projects.ts';

const Projects: React.FC = () => {
  const startupProjects = projectsData.filter((project) => project.category === 'startup');
  const sillyProjects = projectsData.filter((project) => project.category === 'silly');

  return (
    <Section id="projects" title="Projects">
      <div className="mb-8">
        <h3 className="mb-4">Things I built for friendly startups</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {startupProjects.map((project) => (
            <ProjectCard
              key={`startup-${project.title}`}
              title={project.title}
              description={project.description}
              image={project.image}
              liveLink={project.liveLink}
              githubLink={project.githubLink}
              category={project.category}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4">Silly things I made for fun</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sillyProjects.map((project) => (
            <ProjectCard
              key={`silly-${project.title}`}
              title={project.title}
              description={project.description}
              image={project.image}
              liveLink={project.liveLink}
              githubLink={project.githubLink}
              category={project.category}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Projects;
