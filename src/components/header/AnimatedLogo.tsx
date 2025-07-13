import { motion } from 'framer-motion';
import { Variants } from 'motion-dom';

const AnimatedLogo = () => {
  const logoVariants: Variants = {
    initial: {
      opacity: 0,
      x: -50,
      rotate: -180,
    },
    animate: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.a
      href="#"
      className="flex items-center"
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className="font-heading mr-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white/20 text-xl font-bold text-white/70"
        variants={logoVariants}
      >
        A
      </motion.div>
    </motion.a>
  );
};

export default AnimatedLogo;
