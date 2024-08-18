import { useSyncExternalStore } from "react";

function handleResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

export default function useWindowHeight() {
  return useSyncExternalStore(handleResize, () => window.innerHeight);
}
