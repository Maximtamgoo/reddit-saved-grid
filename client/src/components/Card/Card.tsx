import { ReactNode, memo } from "react";
import { Post } from "@src/schema/Post";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";

type Props = {
  post: Post;
  pageParam: string;
  onClickPreview: (post: Post) => void;
};

export default memo(function Card({ post, pageParam, onClickPreview }: Props) {
  let Post: ReactNode = null;

  if (post.type === "text") {
    Post = <Text text={post.text} />;
  } else if (post.type === "comment") {
    Post = <Text text={post.comment} />;
  } else if (post.type === "gallery") {
    Post = (
      <Preview url={post.preview} onClick={() => onClickPreview(post)}>
        {post.gallery.length > 1 && <CornerInfo data={post.gallery.length} />}
      </Preview>
    );
  } else if (post.type === "image") {
    Post = (
      <Preview url={post.preview} onClick={() => onClickPreview(post)}>
        {post.isGif && <CornerInfo data="GIF" />}
      </Preview>
    );
  } else {
    Post = <div className="grid aspect-square place-items-center bg-zinc-800 text-8xl">?</div>;
  }

  return (
    <section className="overflow-hidden rounded-md bg-zinc-800 ring-2 ring-zinc-600">
      <Details post={post} pageParam={pageParam} />
      {Post}
    </section>
  );
});

function CornerInfo({ data }: { data: string | number }) {
  return (
    <div className="absolute right-2 top-2 grid h-8 min-w-8 place-items-center rounded-md bg-zinc-900 px-2 font-semibold">
      {data}
    </div>
  );
}
