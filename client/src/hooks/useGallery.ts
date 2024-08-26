import { useCallback, useEffect, useState } from "react";

export default function useGallery(length: number) {
  const [index, setIndex] = useState(0);
  const prevIndex = useCallback(() => setIndex((i) => (i === 0 ? length - 1 : i - 1)), [length]);
  const nextIndex = useCallback(() => setIndex((i) => (i === length - 1 ? 0 : i + 1)), [length]);

  useEffect(() => {
    function handleArrowKey(e: KeyboardEvent) {
      if (e.code === "ArrowLeft") prevIndex();
      if (e.code === "ArrowRight") nextIndex();
    }
    if (length > 1) {
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
