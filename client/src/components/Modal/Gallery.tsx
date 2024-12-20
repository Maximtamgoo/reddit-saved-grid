import { useGallery } from "@src/hooks/useGallery";
import { GalleryItem } from "@src/schema/RedditItem";
import ArrowBtn from "./ArrowBtn";
import Image from "./Image";
import Playable from "./Playable";

type Props = {
  items: GalleryItem[];
};

export function Gallery({ items }: Props) {
  const { index, prevIndex, nextIndex } = useGallery(items.length);
  const item = items[index];

  return (
    <div className="h-full">
      {item.type === "image" && <Image key={item.source.url} url={item.source.url} />}
      {item.type === "playable" && (
        <Playable key={item.source.url} url={item.source.url} poster={item.preview.url} />
      )}
      {items.length > 1 && (
        <>
          {index > 0 && <ArrowBtn direction="left" onClick={prevIndex} />}
          <div className="absolute bottom-5 left-2/4 grid h-8 min-w-8 -translate-x-2/4 place-items-center rounded-full bg-transparent/90 px-3 font-semibold text-white">
            {index + 1} / {items.length}
          </div>
          {index < items.length - 1 && <ArrowBtn direction="right" onClick={nextIndex} />}
        </>
      )}
    </div>
  );
}
