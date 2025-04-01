import React, { useState, useRef, useEffect } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import Tooltip from '../Tooltip.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyIconProps {
  textToCopy: string;
}

const CopyIcon: React.FC<CopyIconProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle actual copy functionality
  const handleCopy = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setShowTooltip(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Mouse event handlers
  const handlePointerEnter = () => {
    setShowTooltip(true);
  };

  const handlePointerLeave = () => {
    setShowTooltip(false);
    setCopied(false);
  };

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
        setCopied(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div
        data-tooltip-parent="true"
        className="relative cursor-pointer"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onClick={handleCopy}
        onTouchStart={handleCopy}
        role="button"
        tabIndex={0}
        aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCopy();
          }
        }}
      >
        <div className="relative h-5 w-5">
          <AnimatePresence>
            {!copied ? (
              <motion.div
                key="default-copy"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="text-theme-text-secondary hover:text-theme-primary absolute inset-0 transition-colors duration-300"
              >
                <Copy size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="copied"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-theme-primary absolute inset-0"
              >
                <CopyCheck size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Tooltip show={showTooltip} text={copied ? 'Copied!' : 'Copy'} />
      </div>
    </div>
  );
};

export default CopyIcon;
