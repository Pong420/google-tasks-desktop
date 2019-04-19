import React, {
  useRef,
  useLayoutEffect,
  ReactNode,
  HTMLAttributes
} from 'react';
import Simplebar from 'simplebar';
import 'simplebar/dist/simplebar.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ScrollContent({ children, className = '', ...props }: Props) {
  const el = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const simplebar = new Simplebar(el.current);
  }, []);

  return (
    <div className={`scroll-content ${className}`.trim()} ref={el} {...props}>
      {children}
    </div>
  );
}
