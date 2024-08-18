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
    const urls = post.gallery.map((e) => e.url);
    Post = <Gallery urls={urls} />;
  } else if (post.type === "image") {
    Post = <Gallery urls={[post.source.url]} />;
  }

  return (
    <div className="fixed inset-0 bg-slate-50">
      {Post}
      <form method="dialog">
        <button className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300">
          <X />
        </button>
      </form>
      {Post}
    </div>
  );
}
