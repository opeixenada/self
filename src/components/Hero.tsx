import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <motion.section
      className="container mx-auto max-w-5xl py-10 sm:px-6"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      }}
      viewport={{ amount: 0.2, once: true }}
    >
      <h1 className="text-theme-primary mb-4 text-4xl leading-tight font-medium md:text-5xl lg:text-6xl">
        Hi, I'm Anna
      </h1>

      <h2 className="text-theme-secondary mb-6 text-xl md:text-2xl">I build software</h2>
    </motion.section>
  );
};

export default Hero;
