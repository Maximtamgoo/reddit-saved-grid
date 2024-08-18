import Dialog from "@src/components/Modal/Dialog";
import Modal from "@src/components/Modal/Modal";
import { Post } from "@src/schema/Post";
import { memo, useState } from "react";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";

type Props = {
  post: Post;
  width: number;
};

export default memo(function Card({ post, width }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className="relative flex h-full flex-col rounded-lg bg-slate-200 ring-0 ring-slate-300"
      style={{
        minHeight: "350px",
        maxHeight: "calc(100vh - 90px)"
      }}
    >
      <Details post={post} />
      {post.type === "text" && <Text text={post.text} />}
      {post.type === "comment" && <Text text={post.comment} />}
      {post.type === "gallery" && (
        <Preview
          width={width}
          imageData={post.preview}
          galleryLength={post.gallery.length}
          onClick={() => setIsOpen(true)}
        />
      )}
      {post.type === "image" && (
        <Preview
          width={width}
          imageData={post.preview}
          isGif={post.isGif}
          onClick={() => setIsOpen(true)}
        />
      )}
      {isOpen && (
        <Dialog onClose={() => setIsOpen(false)}>
          <Modal post={post} />
        </Dialog>
      )}
    </section>
  );
});
