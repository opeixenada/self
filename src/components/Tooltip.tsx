import React from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  show: boolean;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ show, text }) => {
  if (!show) return null;

  return (
    <motion.div
      key="tooltip"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: -8 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-theme-gold text-theme-text-secondary pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded px-3 py-1 text-sm whitespace-nowrap shadow-md"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {text}
    </motion.div>
  );
};

export default Tooltip;
