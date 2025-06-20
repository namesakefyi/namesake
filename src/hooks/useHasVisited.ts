export function useHasVisited() {
  if (typeof window !== "undefined") {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      localStorage.setItem("hasVisitedBefore", "true");
      return false;
    }
  }
  return true;
}
