import React from 'react';
import ContactForm from './ContactForm';
import { Github, Linkedin, Mail } from 'lucide-react';
import AnimatedIconLink from './AnimatedIconLink.tsx';
import { EMAIL, GITHUB, LINKEDIN } from '../../data/constants.ts';
import CopyIcon from './CopyIcon.tsx';
import AnimatedLink from '../AnimatedLink.tsx';
import Section from '../Section.tsx';

const Contacts: React.FC = () => {
  const subtitleContent = (
    <p>
      Have a project in mind or just want to say hello?
      <br className="hidden md:inline" /> I'm always excited to collaborate on new ideas.
    </p>
  );

  return (
    <Section id="contacts" title="Let's connect" subtitle={subtitleContent}>
      <div className="grid gap-8 space-y-6 md:grid-cols-2">
        {/* Contact Info Side */}
        <div className="card-theme flex h-full flex-col justify-between p-8">
          <div className="space-y-6">
            <div>
              <h3 className="mb-4">Turn your vision into reality</h3>
              <p className="text-theme-secondary leading-relaxed">
                Great things start with a conversation. Whether you need a high-performance backend,
                a cute website, or some expert advice — I'm here to help bring your ideas to life.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <hr className="border-flow-primary/30" />
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
                icon={<Linkedin size={20} />}
              />
              <AnimatedIconLink
                href={GITHUB}
                aria-label="Anna's GitHub"
                icon={<Github size={20} />}
              />
            </div>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="card-theme overflow-hidden p-0">
          <div className="from-flow-darkish/20 to-flow-dark/20 bg-gradient-to-br p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contacts;
