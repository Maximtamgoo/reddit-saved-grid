import { useState, useEffect, RefObject } from "react";

export default function useIntersectionObserver(
  targetRef: RefObject<Element>,
  { root = null, rootMargin = "0%", threshold = 0 }: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  // const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, root, rootMargin, threshold]);

  return isIntersecting;
}
