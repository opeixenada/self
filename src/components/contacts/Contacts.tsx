import React from 'react';
import { Mail } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '../icons/BrandIcons.tsx';
import AnimatedIconLink from './AnimatedIconLink.tsx';
import { EMAIL, GITHUB, LINKEDIN } from '../../data/constants.ts';
import CopyIcon from './CopyIcon.tsx';
import AnimatedLink from '../AnimatedLink.tsx';
import Section from '../Section.tsx';

const Contacts: React.FC = () => {
  return (
    <Section id="contacts">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-2">
          <AnimatedIconLink
            href={`mailto:${EMAIL}`}
            aria-label="Email Anna"
            icon={<Mail size={20} />}
          />

          <div className="flex items-center space-x-2">
            <AnimatedLink href={`mailto:${EMAIL}`}>{EMAIL}</AnimatedLink>
            <CopyIcon textToCopy={EMAIL} />
          </div>
        </div>

        <div className="flex space-x-4">
          <AnimatedIconLink
            href={LINKEDIN}
            aria-label="Anna's LinkedIn"
            icon={<LinkedInIcon size={20} />}
          />

          <AnimatedIconLink href={GITHUB} aria-label="Anna's GitHub" icon={<GitHubIcon size={20} />} />
        </div>
      </div>
    </Section>
  );
};

export default Contacts;
