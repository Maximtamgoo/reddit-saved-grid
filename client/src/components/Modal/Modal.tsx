import { ReactNode } from "react";
import { Post } from "@src/schema/Post";
import X from "@src/svg/x.svg?react";
import { Gallery } from "./Gallery";

type Props = {
  post: Post;
};

export default function Modal({ post }: Props) {
  let Post: ReactNode = null;

  if (post.type === "gallery") {
    Post = <Gallery urls={post.gallery} />;
  } else if (post.type === "image") {
    Post = <Gallery urls={[post.source]} />;
  }

  return (
    <div className="fixed inset-0 bg-black/90">
      {Post}
      <form method="dialog">
        <button
          autoFocus
          className="absolute right-2 top-2 grid size-12 place-items-center overflow-hidden rounded-full bg-black/40 text-blue-500"
        >
          <X className="size-full" />
        </button>
      </form>
    </div>
  );
}
