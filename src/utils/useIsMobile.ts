import { useState } from "react";

const MOBILE_BREAKPOINT = 800;

export function useIsMobile() {
  const query = window.matchMedia(`(width <= ${MOBILE_BREAKPOINT}px)`);
  const [isMobile, setIsMobile] = useState(query.matches);
  query.onchange = () => setIsMobile(query.matches);
  return isMobile;
}
