import { useSyncExternalStore } from "react";

const isMaybeMobile = "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

function handleResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

export function useWindowHeight() {
  return useSyncExternalStore(handleResize, () =>
    isMaybeMobile ? window.outerHeight : window.innerHeight
  );
}
