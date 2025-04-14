import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectItem } from '../../data/projects.ts';
import AnimatedLink from '../AnimatedLink.tsx';

interface ProjectCardProps {
  project: ProjectItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, liveLink, githubLink } = project;

  return (
    <div className="card-theme flex h-full flex-col overflow-hidden">
      <div className="card-theme-header">
        <h3 className="card-theme-title">{title}</h3>
      </div>

      <div className="flex flex-grow flex-col p-4">
        <p className="text-theme-text-secondary mb-4">{description}</p>
        <div className="mt-auto flex justify-between">
          <AnimatedLink
            href={liveLink}
            className="flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} className="mr-1" /> Live
          </AnimatedLink>

          {githubLink && (
            <AnimatedLink
              href={githubLink}
              className="flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
              <Github size={16} className="mr-1" /> Source
            </AnimatedLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
