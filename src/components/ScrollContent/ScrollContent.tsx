import React, {
  useRef,
  useLayoutEffect,
  useCallback,
  ReactNode,
  HTMLAttributes
} from 'react';
import { createPortal } from 'react-dom';
import Simplebar from 'simplebar';
import 'simplebar/dist/simplebar.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ContainerProps {
  children: ReactNode;
  container: () => HTMLDivElement | null;
}

function Container({ children, container: getContainer }: ContainerProps) {
  const container = getContainer();

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}

export function ScrollContent({ children, className = '', ...props }: Props) {
  const useSimplebar = process.platform !== 'darwin';
  const el = useRef<HTMLDivElement | null>(null);
  const getContainer = useCallback(
    () => el.current && el.current.querySelector('.simplebar-resize-wrapper'),
    []
  );

  useLayoutEffect(() => {
    if (useSimplebar) {
      const simplebar = new Simplebar(el.current);
    }
  }, [children, useSimplebar]);

  return (
    <div className={`scroll-content ${className}`.trim()} ref={el} {...props}>
      {useSimplebar ? (
        <Container container={getContainer}>{children}</Container>
      ) : (
        children
      )}
    </div>
  );
}
