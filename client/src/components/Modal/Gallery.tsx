import useGallery from "@src/hooks/useGallery";
import { GalleryItem } from "@src/schema/RedditItem";
import ChevronLeft from "@src/svg/chevron-left.svg?react";
import Image from "./Image";
import Playable from "./Playable";

type Props = {
  items: GalleryItem[];
};

export function Gallery({ items }: Props) {
  const { index, prevIndex, nextIndex } = useGallery(items.length);

  const className =
    "grid place-items-center size-10 shrink-0 rounded-full hover:ring-2 hover:ring-slate-300";

  const ChevronRight = () => <ChevronLeft className="rotate-180" />;

  const item = items[index];

  return (
    <div className="grid h-full grid-rows-1 gap-1">
      {item.type === "image" && <Image url={item.source.url} />}
      {item.type === "playable" && <Playable url={item.source.url} poster={item.preview.url} />}
      {items.length > 1 && (
        <div
          className="m-auto flex items-center gap-2 rounded-full bg-slate-200 text-slate-800 ring-2 ring-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button className={className} onClick={prevIndex}>
            <ChevronLeft />
          </button>
          <div className="mx-auto min-w-16 text-center text-xl">
            {index + 1}/{items.length}
          </div>
          <button className={className} onClick={nextIndex}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
