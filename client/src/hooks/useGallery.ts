import { useState } from "react";

export default function useGallery(gallerylength: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function prevIndex(e: MouseEvent) {
    e.stopPropagation();
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  }

  function nextIndex(e: MouseEvent) {
    e.stopPropagation();
    if (currentIndex === gallerylength - 1) return;
    setCurrentIndex(currentIndex + 1);
  }

  return { currentIndex, prevIndex, nextIndex };
}
