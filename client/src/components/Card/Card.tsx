import { RedditItem } from "@src/schema/RedditItem";
import { memo, useState } from "react";
import Dialog from "../Modal/Dialog";
import Modal from "../Modal/Modal";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";

type Props = {
  item: RedditItem;
};

export default memo(function Card({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg ring-2 ring-slate-200">
      <Details item={item} />
      {(item.type === "text" || item.type === "comment") && <Text text={item.text} />}
      {(item.type === "gallery" || item.type === "image" || item.type === "playable") && (
        <Preview
          url={item.preview.url}
          playable={item.type === "playable"}
          galleryLength={item.type === "gallery" ? item.gallery.length : 0}
          onClick={() => setIsOpen(true)}
        />
      )}
      {item.type === "unknown" && <div className="grid grow place-items-center text-8xl">?</div>}
      {isOpen && (
        <Dialog onClose={() => setIsOpen(false)}>
          <Modal item={item} />
        </Dialog>
      )}
    </section>
  );
});
