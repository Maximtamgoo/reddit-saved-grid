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
  const { mutate } = useToggleBookmark(post.id, post.pageParam);
  const { permalink, subreddit, author } = post;
  const postLink = `https://www.reddit.com${permalink}`;
  const subredditLink = `https://www.reddit.com/r/${subreddit}`;
  const authorLink = `https://www.reddit.com/u/${author}`;

  return (
    <div className="grid h-24 shrink-0 gap-2 p-4">
      <div className="flex min-w-0">
        <Link
          className="size-6 shrink-0 overflow-hidden rounded-full bg-slate-200"
          href={subredditLink}
        >
          {isSuccess && !isImgError && <img src={icon} onError={() => setIsImgError(true)} />}
        </Link>
        <div className="grow truncate text-slate-600">
          <Link className="hover:text-slate-800 hover:underline" href={subredditLink}>
            <span className="pl-2 text-sm">r</span>/{subreddit}
          </Link>
          <span className="px-1">&bull;</span>
          <Link className="hover:text-slate-800 hover:underline" href={authorLink}>
            <span className="text-sm">u</span>/{author}
          </Link>
        </div>
        <div className="relative w-14 shrink-0">
          <button
            className="absolute -top-7 size-14"
            onClick={() => mutate({ saved: !post.saved })}
          >
            <Bookmark
              className={`size-full hover:stroke-sky-600 ${!post.saved && "fill-slate-100"}`}
            />
          </button>
        </div>
      </div>
      <Link className="truncate text-xl font-medium" href={postLink}>
        {post.type === "comment" ? "Comment" : post.title}
      </Link>
    </div>
  );
}
