import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { EMAIL, GITHUB, LINKEDIN } from '../../data/constants.ts';
import { motion } from 'framer-motion';
import SocialLink from './SocialLink.tsx';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      }}
      className="font-heading border-t border-black bg-white/20"
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 text-center md:flex-row md:text-left">
        <div className="flex gap-4">
          <SocialLink href={`mailto:${EMAIL}`} ariaLabel="Anna's E-mail">
            <Mail size={20} />
          </SocialLink>

          <SocialLink href={LINKEDIN} ariaLabel="Anna's LinkedIn">
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Linkedin size={20} />
          </SocialLink>

          <SocialLink href={GITHUB} ariaLabel="Anna's GitHub">
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Github size={20} />
          </SocialLink>
        </div>

        <p className="text-theme-secondary text-sm">
          &copy; Anna Yudina {new Date().getFullYear()}
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
