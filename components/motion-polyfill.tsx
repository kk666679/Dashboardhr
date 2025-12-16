// Simple polyfill for motion
export const motion = {
  div: (props: any) => {
    const { children, ...rest } = props;
    return <div {...rest}>{children}</div>;
  },
  span: (props: any) => {
    const { children, ...rest } = props;
    return <span {...rest}>{children}</span>;
  },
  section: (props: any) => {
    const { children, ...rest } = props;
    return <section {...rest}>{children}</section>;
  },
  article: (props: any) => {
    const { children, ...rest } = props;
    return <article {...rest}>{children}</article>;
  },
  header: (props: any) => {
    const { children, ...rest } = props;
    return <header {...rest}>{children}</header>;
  },
  footer: (props: any) => {
    const { children, ...rest } = props;
    return <footer {...rest}>{children}</footer>;
  }
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
