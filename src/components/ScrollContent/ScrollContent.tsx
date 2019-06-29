import React, {
  useRef,
  useState,
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
  const [simplebar, setSimplebar] = useState<any>(null);

  useLayoutEffect(() => {
    if (useSimplebar) {
      setSimplebar(new Simplebar(el.current));
    }
  }, [children]);

  useImperativeHandle<SimplebarAPI, SimplebarAPI>(simplebarRef, () => ({
    getScrollElement() {
      if (useSimplebar) {
        return simplebar.getScrollElement();
      }
      return el.current;
    }
  }));

  return (
    <div {...props} className={`scroll-content ${className}`.trim()} ref={el}>
      {useSimplebar && el.current ? (
        <Container container={el.current}>{children}</Container>
      ) : (
        children
      )}
    </div>
  );
};
