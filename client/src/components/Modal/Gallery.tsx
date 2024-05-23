import { useState } from "react";
import useGallery from "@src/hooks/useGallery";
import Left from "@src/svg/chevron-left.svg?react";
import Right from "@src/svg/chevron-right.svg?react";

type Props = {
  urls: string[];
};

export function Gallery({ urls }: Props) {
  const { index, prevIndex, nextIndex } = useGallery(urls.length);
  const [isError, setIsError] = useState(false);

  if (isError) {
    return <div className="grid size-full place-items-center text-8xl">?</div>;
  }

  return (
    <div className="grid h-full grid-rows-1 gap-1 p-1">
      <div className="flex items-center justify-center">
        <img
          className="max-h-full max-w-full"
          key={urls[index]}
          src={urls[index]}
          onClick={(e) => e.stopPropagation()}
          onError={() => setIsError(true)}
          alt="Reddit Content"
        />
      </div>
      {urls.length > 1 && (
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <button className="size-10 overflow-hidden rounded-full" onClick={prevIndex}>
            <Left className="size-full" />
          </button>
          <div className="grid max-w-[50%] grow place-items-center text-2xl">
            {index + 1}/{urls.length}
          </div>
          <button className="size-10 overflow-hidden rounded-full" onClick={nextIndex}>
            <Right className="size-full" />
          </button>
        </div>
      )}
    </div>
  );
}
