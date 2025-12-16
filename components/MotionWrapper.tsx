import React from 'react';

// Simple wrapper to replace framer-motion temporarily
export const motion = {
  div: React.forwardRef((props: any, ref: any) => 
    React.createElement('div', { ...props, ref })
  ),
  span: React.forwardRef((props: any, ref: any) => 
    React.createElement('span', { ...props, ref })
  ),
  section: React.forwardRef((props: any, ref: any) => 
    React.createElement('section', { ...props, ref })
  ),
  article: React.forwardRef((props: any, ref: any) => 
    React.createElement('article', { ...props, ref })
  ),
  header: React.forwardRef((props: any, ref: any) => 
    React.createElement('header', { ...props, ref })
  ),
  footer: React.forwardRef((props: any, ref: any) => 
    React.createElement('footer', { ...props, ref })
  ),
  // Add more as needed
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
