import { useSyncExternalStore } from "react";

function handleResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

export function useWindowOuterHeight() {
  return useSyncExternalStore(handleResize, () => window.outerHeight);
}
