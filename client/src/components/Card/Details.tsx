import Link from "@src/components/Link";
import { Post } from "@src/schema/Post";
import { useGetSubRedditIcon, useToggleBookmark } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import { useState } from "react";

type Props = {
  post: Post;
};

export default function Details({ post }: Props) {
  const { data: icon, isSuccess } = useGetSubRedditIcon(post.subreddit);
  const [isImgError, setIsImgError] = useState(false);
  const { mutate, isPending } = useToggleBookmark(post.id, post.pageParam);
  const { permalink, subreddit, author } = post;
  const postLink = `https://www.reddit.com${permalink}`;
  const subredditLink = `https://www.reddit.com/r/${subreddit}`;
  const authorLink = `https://www.reddit.com/u/${author}`;

  return (
    <div className="grid gap-2 p-3.5">
      <div className="flex min-w-0 gap-1">
        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-slate-300">
          {isSuccess && !isImgError && <img src={icon} onError={() => setIsImgError(true)} />}
        </div>
        <div className="flex min-w-0 grow items-center text-slate-600">
          <Link
            className="truncate rounded-lg px-1 py-0.5 hover:bg-slate-200 hover:text-slate-800 focus:bg-slate-200 focus:text-slate-800 focus:outline-none"
            href={subredditLink}
          >
            <span className="text-sm">r</span>/{subreddit}
          </Link>
          <span className="px-0.5">&bull;</span>
          <Link
            className="truncate rounded-lg px-1 py-0.5 hover:bg-slate-200 hover:text-slate-800 focus:bg-slate-200 focus:text-slate-800 focus:outline-none"
            href={authorLink}
          >
            <span className="text-sm">u</span>/{author}
          </Link>
        </div>
        <button
          className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-sky-200 focus:bg-sky-200 focus:outline-none"
          disabled={isPending}
          onClick={() => mutate({ saved: !post.saved })}
        >
          <Bookmark className={`stroke-sky-500 ${post.saved && "fill-sky-500"}`} />
        </button>
      </div>
      <Link
        className="max-w-fit truncate rounded-lg px-1 py-0.5 text-xl font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 focus:outline-none"
        href={postLink}
      >
        {post.type === "comment" ? "Comment" : post.title}
      </Link>
    </div>
  );
}
