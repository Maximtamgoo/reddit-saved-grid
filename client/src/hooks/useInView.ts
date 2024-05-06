import { useState, useRef, useCallback } from "react";

export function useInView() {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver>();

  const ref = useCallback((element: HTMLElement | null) => {
    let observer = observerRef.current;
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (element) observer.observe(element);
  }, []);

  return { ref, inView };
}
