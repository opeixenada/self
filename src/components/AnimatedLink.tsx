import React from 'react';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  rel?: string;
  target?: string;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  href,
  children,
  onClick,
  className = '',
  rel = '',
  target = '',
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      rel={rel}
      target={target}
      className={`text-theme-text-secondary hover:text-theme-primary group relative transition-colors duration-300 ${className}`}
    >
      {children}
      <span className="bg-theme-primary absolute bottom-0 left-0 h-0.25 w-0 transition-all duration-300 ease-in-out group-hover:w-full"></span>
    </a>
  );
};

export default AnimatedLink;
