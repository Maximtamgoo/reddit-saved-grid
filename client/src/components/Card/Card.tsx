import Dialog from "@src/components/Modal/Dialog";
import Modal from "@src/components/Modal/Modal";
import { Post } from "@src/schema/Post";
import { memo, useState } from "react";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";

type Props = {
  post: Post;
};

export default memo(function Card({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = () => setIsOpen(true);

  return (
    <section className="relative flex h-full flex-col rounded-lg bg-slate-100 ring-2 ring-slate-300">
      <Details post={post} />
      {post.type === "text" && <Text text={post.text} />}
      {post.type === "comment" && <Text text={post.comment} />}
      {post.type === "gallery" && (
        <Preview url={post.preview.url} galleryLength={post.gallery.length} onClick={onClick} />
      )}
      {post.type === "image" && (
        <Preview url={post.preview.url} isGif={post.isGif} onClick={onClick} />
      )}
      {post.type === "unknown" && <div className="grid grow place-items-center text-8xl">?</div>}
      {isOpen && (
        <Dialog onClose={() => setIsOpen(false)}>
          <Modal post={post} />
        </Dialog>
      )}
    </section>
  );
});
