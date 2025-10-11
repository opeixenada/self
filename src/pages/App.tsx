import React from 'react';
import Header from '../components/header/Header.tsx';
import Footer from '../components/footer/Footer.tsx';
import Contacts from '../components/contacts/Contacts.tsx';
import Hero from '../components/Hero.tsx';
import About from '../components/About.tsx';
import { domAnimation, LazyMotion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 space-y-8 px-4 pt-10 pb-8 md:pt-14 md:pb-10">
          <Hero />
          <About />
          <Contacts />
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
};

export default App;
