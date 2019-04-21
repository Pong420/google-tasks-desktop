import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useImperativeHandle,
  ReactNode,
  RefObject,
  HTMLAttributes
} from 'react';
import { createPortal } from 'react-dom';
import Simplebar from 'simplebar';
import 'simplebar/dist/simplebar.css';

export interface SimplebarAPI {
  getScrollElement(): HTMLDivElement;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  simplebarRef?: RefObject<SimplebarAPI | null>;
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

export function ScrollContent({
  children,
  className = '',
  simplebarRef,
  ...props
}: Props) {
  const useSimplebar = process.platform !== 'darwin';
  const el = useRef<HTMLDivElement | null>(null);
  const getContainer = useCallback(
    () => el.current && el.current.querySelector('.simplebar-resize-wrapper'),
    []
  );
  const [simplebar, setSimplebar] = useState<any>(null);

  useLayoutEffect(() => {
    if (useSimplebar) {
      setSimplebar(new Simplebar(el.current));
    }
  }, [children, useSimplebar]);

  useImperativeHandle(simplebarRef, () => ({
    getScrollElement() {
      if (useSimplebar) {
        return simplebar.getScrollElement();
      }

      return el.current;
    }
  }));

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
