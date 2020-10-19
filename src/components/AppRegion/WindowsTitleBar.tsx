import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { themeSelector } from '../../store';
import { ReactComponent as Logo } from '../../assets/logo.svg';

const WindowsTitleBarComp = React.lazy(() =>
  import('react-desktop/windows').then(({ TitleBar }) => ({
    default: TitleBar
  }))
);

const {
  isMaximized,
  minimize,
  maximize,
  unmaximize,
  close
} = window.getCurrentWindow();

function toggleMaximize() {
  isMaximized() ? unmaximize() : maximize();
}

export function WindowsTitleBar() {
  const [isFullscreen, setIsFullscreen] = useState(isMaximized());
  const theme = useSelector(themeSelector);

  useEffect(() => {
    function onResize() {
      setIsFullscreen(isMaximized());
    }

    onResize();

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="app-region">
      <Suspense fallback={null}>
        <WindowsTitleBarComp
          title={
            <div className="windows-title">
              <Logo />
              Google Tasks
            </div>
          }
          controls
          theme={theme}
          background="var(--main-color)"
          isMaximized={isFullscreen}
          onCloseClick={() => close()}
          onMinimizeClick={() => minimize()}
          onMaximizeClick={() => toggleMaximize()}
          onRestoreDownClick={() => toggleMaximize()}
        />
      </Suspense>
    </div>
  );
}
