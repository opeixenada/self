import React from 'react';

interface SocialLinkProps {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, ariaLabel, children }) => {
  return (
    <a
      href={href}
      className="text-theme-text-secondary hover:text-theme-primary group relative inline-flex h-8 w-8 items-center justify-center transition-colors duration-300"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      <span className="group-hover:bg-theme-amber/90 absolute inset-0 -m-2 origin-center scale-0 transform rounded-full bg-transparent transition-all duration-300 group-hover:scale-100"></span>
      <span className="relative z-10">{children}</span>
    </a>
  );
};

export default SocialLink;
