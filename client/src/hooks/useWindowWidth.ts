import { useSyncExternalStore } from "react";

function handleResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

export default function useWindowWidth() {
  return useSyncExternalStore(handleResize, () => window.innerWidth);
}
