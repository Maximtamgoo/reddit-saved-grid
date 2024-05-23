import { ReactNode, memo, useState } from "react";
import { Post } from "@src/schema/Post";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";
import Dialog from "@src/components/Modal/Dialog";
import Modal from "@src/components/Modal/Modal";

type Props = {
  post: Post;
  pageParam: string;
};

export default memo(function Card({ post, pageParam }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  let Post: ReactNode = null;

  if (post.type === "text") {
    Post = <Text text={post.text} />;
  } else if (post.type === "comment") {
    Post = <Text text={post.comment} />;
  } else if (post.type === "gallery") {
    Post = (
      <Preview url={post.preview} onClick={() => setIsOpen(true)}>
        {post.gallery.length > 1 && <CornerInfo data={post.gallery.length} />}
      </Preview>
    );
  } else if (post.type === "image") {
    Post = (
      <Preview url={post.preview} onClick={() => setIsOpen(true)}>
        {post.isGif && <CornerInfo data="GIF" />}
      </Preview>
    );
  } else {
    Post = <div className="grid aspect-square place-items-center text-8xl">?</div>;
  }

  return (
    <section className="rounded-lg bg-slate-100 ring-2 ring-slate-300">
      <Details post={post} pageParam={pageParam} />
      {Post}
      {isOpen && (
        <Dialog onClose={() => setIsOpen(false)}>
          <Modal post={post} />
        </Dialog>
      )}
    </section>
  );
});

function CornerInfo({ data }: { data: string | number }) {
  return (
    <div className="ring-3 absolute right-2 top-2 grid h-7 min-w-7 place-items-center rounded-md bg-slate-100 px-2 font-semibold ring-2 ring-slate-300">
      {data}
    </div>
  );
}
