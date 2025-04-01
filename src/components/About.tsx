import React from 'react';
import Section from './Section.tsx';
import { Download } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Section id="about" title="About me">
      <div className="flex flex-col items-center">
        <article className="prose text-theme-secondary max-w-2xl">
          <p>
            I'm a software engineer and tech lead. My main trade is building scalable,
            high-performance backend systems. I love math, puzzles, and neat architecture. I believe
            picking the right tool for the job is very important, so I stay flexible and curious —
            I've worked across a range of languages and technologies depending on the challenge at
            hand.
          </p>
          <p>
            I'm especially drawn to projects with a strong ethical core, tech that aims to make a
            real difference. Outside of work, I enjoy building little web projects, urban gardening,
            and practicing yoga.
          </p>
          <p>Based in Berlin.</p>
        </article>

        <div className="mt-6">
          <a
            href="/src/assets/anna_yudina_cv.pdf"
            download
            className="btn-theme-outline inline-flex items-center justify-center gap-2"
          >
            <Download size={18} />
            <span className="inline-block">Here's my CV</span>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default About;
