import { useCallback, useEffect, useState } from "react";

export function useGallery(length: number) {
  const [index, setIndex] = useState(0);
  const prevIndex = useCallback(() => setIndex((i) => (i === 0 ? 0 : i - 1)), []);
  const nextIndex = useCallback(() => setIndex((i) => (i === length - 1 ? i : i + 1)), [length]);

  useEffect(() => {
    if (length > 1) {
      function handleArrowKey(e: KeyboardEvent) {
        if (e.code === "ArrowLeft") prevIndex();
        if (e.code === "ArrowRight") nextIndex();
      }
      window.addEventListener("keydown", handleArrowKey);
      return () => window.removeEventListener("keydown", handleArrowKey);
    }
  }, [length, prevIndex, nextIndex]);

  return {
    index,
    prevIndex,
    nextIndex
  };
}
