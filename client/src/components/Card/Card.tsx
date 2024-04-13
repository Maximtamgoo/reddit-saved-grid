import { ReactNode } from "react";
import { Post } from "@src/schema/Post";
import Details from "./Details";
import Preview from "./Preview";
// import Comment from "./Comment";

type Props = {
  post: Post;
  onClickPreview: (post: Post) => void;
};

export default function Card({ post, onClickPreview }: Props) {
  let Post: ReactNode = null;

  // if (post.type === "text") {
  //   Post = <div className="line-clamp-6 aspect-square">{post.text}</div>;
  // } else
  if (post.type === "gallery") {
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
    // } else if (post.type === "comment") {
    //   Post = <Comment permalink={post.permalink} comment={post.comment} />;
  } else {
    Post = <div className="grid aspect-square place-items-center bg-zinc-800 text-8xl">?</div>;
  }

  return (
    <div className="relative grid gap-1 overflow-hidden rounded-xl">
      <Details post={post} />
      {Post}
    </div>
  );
}

function CornerInfo({ data }: { data: string | number }) {
  return (
    <div className="absolute right-2 top-2 grid h-8 min-w-8 place-items-center rounded-md bg-zinc-900 px-2 font-semibold">
      {data}
    </div>
  );
}
