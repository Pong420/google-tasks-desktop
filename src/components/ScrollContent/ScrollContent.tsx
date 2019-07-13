import React, {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  ReactNode,
  HTMLAttributes
} from 'react';
import { createPortal } from 'react-dom';
import { SimplebarAPI, WithSimplebar } from '../../typings';
import Simplebar from 'simplebar';
import 'simplebar/dist/simplebar.css';

interface Props extends HTMLAttributes<HTMLDivElement>, WithSimplebar {
  children: ReactNode;
}

interface ContainerProps {
  children: ReactNode;
  container: HTMLDivElement | null;
}

function Container({ children, container }: ContainerProps) {
  if (!container) {
    return null;
  }

  return createPortal(children, container);
}

const useSimplebar = process.platform !== 'darwin';

export const ScrollContent = ({
  children,
  className = '',
  simplebarRef,
  ...props
}: Props) => {
  const el = useRef<HTMLDivElement>(null);
  const [simplebar, setSimplebar] = useState<SimplebarAPI>();
  const getContainer = useCallback(
    () => el.current && el.current.querySelector('.simplebar-resize-wrapper'),
    []
  );

  useLayoutEffect(() => {
    if (useSimplebar) {
      setSimplebar(new Simplebar(el.current));
    }
  }, [children]);

  useImperativeHandle<SimplebarAPI, SimplebarAPI>(simplebarRef, () => ({
    getScrollElement() {
      return useSimplebar && simplebar
        ? simplebar.getScrollElement()
        : el.current;
    }
  }));

  return (
    <div {...props} className={`scroll-content ${className}`.trim()} ref={el}>
      {useSimplebar && getContainer() ? (
        <Container container={getContainer()}>{children}</Container>
      ) : (
        children
      )}
    </div>
  );
};
