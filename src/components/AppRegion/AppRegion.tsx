import React, { useState, useEffect } from 'react';
import { TitleBar as MacOSTitleBar } from 'react-desktop/macOs';
import { remote } from 'electron';

const {
  isMaximized,
  minimize,
  maximize,
  unmaximize,
  close
} = remote.getCurrentWindow();

function toggleMaximize() {
  isMaximized() ? unmaximize() : maximize();
}

export function AppRegion() {
  const [isFullscreen, setIsFullscreen] = useState(isMaximized());

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
      <MacOSTitleBar
        title=" "
        inset
        controls
        transparent
        isFullscreen={isFullscreen}
        onCloseClick={() => close()}
        onMinimizeClick={() => minimize()}
        onResizeClick={() => toggleMaximize()}
      />
    </div>
  );
}
