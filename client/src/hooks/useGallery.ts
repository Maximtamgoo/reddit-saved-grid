import { useState } from "react";

export default function useGallery(gallerylength: number) {
  const [index, setIndex] = useState(0);

  return {
    index,
    prevIndex: () => setIndex(index === 0 ? gallerylength - 1 : index - 1),
    nextIndex: () => setIndex(index === gallerylength - 1 ? 0 : index + 1)
  };
}
