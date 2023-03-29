// typescript
import React, { useState, useEffect } from "react";

// Custom hook to get window width
export const useWindowWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return windowWidth;
};

const ScreenWidthChecker: React.FC = () => {
  const screenWidth = useWindowWidth();

  return (
    <div>
      <p>The screen width is: {screenWidth}px</p>
    </div>
  );
};

export default ScreenWidthChecker;
