// List of framer-motion specific props that should not be passed to DOM elements
const motionProps = [
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileDrag',
  'drag',
  'dragConstraints',
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'layout',
  'layoutId',
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
  'style',
  'transformTemplate',
  'custom',
];

const filterMotionProps = (props: any) => {
  const filteredProps: any = {};
  for (const key in props) {
    if (!motionProps.includes(key)) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
};

import React from 'react';

// Simple wrapper to replace framer-motion temporarily
export const motion = {
  div: React.forwardRef((props: any, ref: any) =>
    React.createElement('div', { ...filterMotionProps(props), ref })
  ),
  span: React.forwardRef((props: any, ref: any) =>
    React.createElement('span', { ...filterMotionProps(props), ref })
  ),
  section: React.forwardRef((props: any, ref: any) =>
    React.createElement('section', { ...filterMotionProps(props), ref })
  ),
  article: React.forwardRef((props: any, ref: any) =>
    React.createElement('article', { ...filterMotionProps(props), ref })
  ),
  header: React.forwardRef((props: any, ref: any) =>
    React.createElement('header', { ...filterMotionProps(props), ref })
  ),
  footer: React.forwardRef((props: any, ref: any) =>
    React.createElement('footer', { ...filterMotionProps(props), ref })
  ),
  button: React.forwardRef((props: any, ref: any) =>
    React.createElement('button', { ...filterMotionProps(props), ref })
  ),
  // Add more as needed
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
