import { RedditItem } from "@src/schema/RedditItem";
import { useBrowserLocation } from "wouter/use-browser-location";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";

type Props = {
  item: RedditItem;
};

export default function Card({ item }: Props) {
  const navigate = useBrowserLocation()[1];
  const onClick = () => navigate(`/modal/${item.id}`, { state: item });

  const previewUrl =
    item.type === "gallery" ? item.preview.u : item.type === "image" ? item.preview.url : undefined;

  const galleryLength = item.type === "gallery" ? item.gallery.length : 0;

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-lg ring-2 ring-slate-200">
      <Details item={item} />
      {(item.type === "text" || item.type === "comment") && <Text text={item.text} />}
      {(item.type === "gallery" || item.type === "image") && previewUrl && (
        <Preview url={previewUrl} galleryLength={galleryLength} onClick={onClick} />
      )}
      {item.type === "unknown" && <div className="grid grow place-items-center text-8xl">?</div>}
    </section>
  );
}
