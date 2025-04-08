import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children }) => {
  const variants = {
    // Variant for mobile: only fades in, no vertical animation
    fadeOnly: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    },
    // Variant for desktop: includes vertical animation
    fadeAndSlide: {
      hidden: { opacity: 0, y: 100 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    },
  };

  return (
    <>
      {/* Mobile version (hidden on md and up) */}
      <motion.section
        id={id}
        className={`container mx-auto max-w-5xl py-10 sm:px-6 md:hidden`}
        variants={variants.fadeOnly}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
      >
        {(title ?? subtitle) && (
          <header className="mb-6 text-center md:mb-8">
            {title && <h2 className="mb-4">{title}</h2>}
            {subtitle && (
              <div className="text-theme-secondary mx-auto max-w-2xl text-lg">{subtitle}</div>
            )}
          </header>
        )}

        <main>{children}</main>
      </motion.section>

      {/* Desktop version (hidden below md) */}
      <motion.section
        id={id}
        className={`container mx-auto hidden max-w-5xl py-10 sm:px-6 md:block`}
        variants={variants.fadeAndSlide}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
      >
        {(title ?? subtitle) && (
          <header className="mb-6 text-center md:mb-8">
            {title && <h2 className="mb-4">{title}</h2>}
            {subtitle && (
              <div className="text-theme-secondary mx-auto max-w-2xl text-lg">{subtitle}</div>
            )}
          </header>
        )}

        <main>{children}</main>
      </motion.section>
    </>
  );
};

export default Section;
