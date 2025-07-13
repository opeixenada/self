import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AnimatedLink from '../AnimatedLink.tsx';
import AnimatedLogo from './AnimatedLogo.tsx';
import { AnimatePresence, motion, stagger } from 'framer-motion';
import { Variants } from 'motion-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Animation variants for the container
  const mobileMenuContainerVariants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          duration: 0.4,
          ease: [0.04, 0.62, 0.23, 0.98], // Custom easing for smooth motion
        },
        opacity: {
          duration: 0.3,
          delay: 0.1, // Delay opacity to create sequence
        },
        delayChildren: stagger(0.05, { startDelay: 0.1 }),
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
        opacity: {
          duration: 0.2,
        },
        when: 'afterChildren', // Exit children first
        delayChildren: stagger(0.05, { from: 'last' }),
      },
    },
  };

  // Animation variants for menu items
  const menuItemVariants: Variants = {
    hidden: {
      x: -20,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      }}
      viewport={{ once: true }}
      className="border-b border-black bg-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <AnimatedLogo />

          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="text-theme-text-secondary hover:text-theme-primary"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <AnimatedLink href="#about">About</AnimatedLink>
              </li>
              <li>
                <AnimatedLink href="#projects">Projects</AnimatedLink>
              </li>
              <li>
                <AnimatedLink href="#contacts">Contacts</AnimatedLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="overflow-hidden md:hidden"
              variants={mobileMenuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.nav className="py-2">
                <ul className="mt-4 flex flex-col space-y-4">
                  <motion.li variants={menuItemVariants}>
                    <AnimatedLink href="#about">About</AnimatedLink>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <AnimatedLink href="#projects">Projects</AnimatedLink>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <AnimatedLink href="#contacts">Contacts</AnimatedLink>
                  </motion.li>
                </ul>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
