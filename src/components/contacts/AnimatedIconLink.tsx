import React from 'react';
import { motion } from 'framer-motion';

const AnimatedIconLink: React.FC<{ href: string; 'aria-label': string; icon: React.ReactNode }> = ({
  href,
  'aria-label': ariaLabel,
  icon,
}) => {
  return (
    <motion.a
      href={href}
      className="text-theme-text-primary flex h-12 w-12 items-center justify-center rounded-full"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      initial={{
        backgroundColor: 'var(--color-theme-coral)',
        opacity: 0.7,
      }}
      whileHover={{
        backgroundColor: 'var(--color-theme-amber)',
        opacity: 1,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.a>
  );
};

export default AnimatedIconLink;
