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
    return <div className="grid h-full w-full place-items-center text-8xl text-blue-500">?</div>;
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
        <div className="flex justify-center text-blue-500" onClick={(e) => e.stopPropagation()}>
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
