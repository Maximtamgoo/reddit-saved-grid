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
        {post.gallery.length > 1 && (
          <div className="absolute right-2 top-2 grid h-10 min-w-10 place-items-center rounded-md bg-zinc-900 px-2 text-lg">
            {post.gallery.length}
          </div>
        )}
      </Preview>
    );
  } else if (post.type === "image") {
    Post = (
      <Preview url={post.preview} onClick={() => onClickPreview(post)}>
        {post.isGif && (
          <div className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-md bg-zinc-900">
            GIF
          </div>
        )}
      </Preview>
    );
    // } else if (post.type === "comment") {
    //   Post = <Comment permalink={post.permalink} comment={post.comment} />;
  } else {
    Post = <div className="grid aspect-square place-items-center text-8xl">?</div>;
  }

  return (
    <div className="rounded-md bg-zinc-800 p-2">
      <Details post={post} />
      {Post}
    </div>
  );
}
