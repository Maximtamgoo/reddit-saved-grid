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

  const className =
    "grid place-items-center size-10 shrink-0 rounded-full hover:ring-2 hover:ring-slate-300";

  return (
    <div className="grid h-full grid-rows-1 gap-1 p-1">
      <div className="flex items-center justify-center">
        {isError ? (
          <div className="text-8xl">?</div>
        ) : (
          <img
            className="max-h-full max-w-full"
            key={urls[index]}
            src={urls[index]}
            onClick={(e) => e.stopPropagation()}
            onError={() => setIsError(true)}
            alt="Reddit Content"
          />
        )}
      </div>
      {urls.length > 1 && (
        <div
          className="mx-auto flex items-center gap-2 rounded-full bg-slate-200 text-slate-800 ring-2 ring-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button className={className} onClick={prevIndex}>
            <Left />
          </button>
          <div className="mx-auto min-w-16 text-center text-xl">
            {index + 1}/{urls.length}
          </div>
          <button className={className} onClick={nextIndex}>
            <Right />
          </button>
        </div>
      )}
    </div>
  );
}
