import { useEffect, useState } from "react";

const MOBILE_WIDTH = 800;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(`(width <= ${MOBILE_WIDTH}px)`).matches,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia(`(width <= ${MOBILE_WIDTH}px)`).matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
