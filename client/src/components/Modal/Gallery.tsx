import { useEffect } from "react";
import useGallery from "../../hooks/useGallery";
import Left from "../../svg/chevron-left.svg?react";
import Right from "../../svg/chevron-right.svg?react";
import Source from "./Source";

type Props = {
  urls: string[];
};

export function Gallery({ urls }: Props) {
  const { index, prevIndex, nextIndex } = useGallery(urls.length);

  useEffect(() => {
    function handleArrowKey(e: KeyboardEvent) {
      if (e.code === "ArrowLeft") prevIndex();
      if (e.code === "ArrowRight") nextIndex();
    }
    if (urls.length > 1) {
      window.addEventListener("keydown", handleArrowKey);
      return () => window.removeEventListener("keydown", handleArrowKey);
    }
  }, [urls.length, prevIndex, nextIndex]);

  return (
    <div className="grid h-full w-full grid-rows-1 gap-2">
      <Source url={urls[index]} />
      {urls.length > 1 && (
        <div className="flex justify-center text-blue-500">
          <button
            className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full"
            onClick={prevIndex}
          >
            <Left className="h-full w-full" />
          </button>
          <div className="grid max-w-[50%] grow place-items-center text-xl">
            {index + 1}/{urls.length}
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full"
            onClick={nextIndex}
          >
            <Right className="h-full w-full" />
          </button>
        </div>
      )}
    </div>
  );
}
