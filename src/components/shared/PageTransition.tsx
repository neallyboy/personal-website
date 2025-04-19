'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ANIMATION } from '@/utils/constants';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: ANIMATION.DEFAULT_DURATION, 
        ease: ANIMATION.DEFAULT_EASE 
      }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;