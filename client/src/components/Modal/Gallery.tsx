import useGallery from "@src/hooks/useGallery";
import ChevronLeft from "@src/svg/chevron-left.svg?react";
import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { useRef, useState } from "react";

type Props = {
  urls: string[];
};

export function Gallery({ urls }: Props) {
  const { index, prevIndex, nextIndex } = useGallery(urls.length);
  const cacheRef = useRef(new Set<string>());

  const isLoaded = cacheRef.current.has(urls[index]);
  const addToCache = (url: string) => cacheRef.current.add(url);

  const className =
    "grid place-items-center size-10 shrink-0 rounded-full hover:ring-2 hover:ring-slate-300";

  const ChevronRight = () => <ChevronLeft className="rotate-180" />;

  return (
    <div className="grid h-full grid-rows-1 gap-1 p-1">
      <Item key={urls[index]} url={urls[index]} isLoaded={isLoaded} addToCache={addToCache} />
      {urls.length > 1 && (
        <div className="m-auto flex items-center gap-2 rounded-full bg-slate-200 text-slate-800 ring-2 ring-slate-200">
          <button className={className} onClick={prevIndex}>
            <ChevronLeft />
          </button>
          <div className="mx-auto min-w-16 text-center text-xl">
            {index + 1}/{urls.length}
          </div>
          <button className={className} onClick={nextIndex}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

type ItemProps = {
  url: string;
  isLoaded: boolean;
  addToCache: (url: string) => void;
};

function Item({ url, isLoaded, addToCache }: ItemProps) {
  const [loading, setLoading] = useState(!isLoaded);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      {isError ? (
        <div className="text-8xl">?</div>
      ) : (
        <img
          className="max-h-full max-w-full"
          src={url}
          onLoad={() => {
            addToCache(url);
            setLoading(false);
          }}
          onError={() => {
            setIsError(true);
            setLoading(false);
          }}
          alt="Reddit Content"
        />
      )}
      {loading && (
        <div className="absolute inset-0 grid place-items-center">
          <LoaderCircle className="size-14 animate-spin rounded-full" />
        </div>
      )}
    </div>
  );
}
