import { Post } from "@src/schema/Post";
import ArrowLeft from "@src/svg/arrow-left.svg?react";
import ArrowRedirect from "@src/svg/square-arrow-out-up-right.svg?react";

import Link from "../Link";
import { Gallery } from "./Gallery";

type Props = {
  post: Post;
};

export default function Modal({ post }: Props) {
  const subredditLink = `https://www.reddit.com/r/${post.subreddit}`;
  return (
    <div className="fixed inset-0 bg-slate-50">
      {post.type === "gallery" && <Gallery urls={post.gallery.map((e) => e.url)} />}
      {post.type === "image" && <Gallery urls={[post.source.url]} />}
      <form method="dialog">
        <button className="absolute left-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300">
          <ArrowLeft />
        </button>
      </form>
      <Link
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300"
        href={subredditLink}
      >
        <ArrowRedirect />
      </Link>
    </div>
  );
}
