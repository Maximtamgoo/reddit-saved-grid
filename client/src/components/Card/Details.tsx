import Link from "@src/components/Link";
import type { RedditItem } from "@src/schema/RedditItem";
import { useGetSubRedditIcon, useToggleBookmark } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import { useState } from "react";

type Props = {
  item: RedditItem;
};

export default function Details({ item }: Props) {
  const { data: icon, isSuccess } = useGetSubRedditIcon(item.subreddit);
  const [isImgError, setIsImgError] = useState(false);
  const { mutate, isPending } = useToggleBookmark(item.id, item.pageParam);
  const postLink = `https://www.reddit.com${item.permalink}`;
  const subredditLink = `https://www.reddit.com/r/${item.subreddit}`;
  const authorLink = `https://www.reddit.com/u/${item.author}`;

  return (
    <div className="grid gap-2 p-4">
      <div className="flex min-w-0 gap-2">
        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-slate-300">
          {isSuccess && !isImgError && <img src={icon} onError={() => setIsImgError(true)} />}
        </div>
        <div className="flex min-w-0 grow items-center text-slate-600">
          <Link className="truncate hover:text-slate-800 hover:underline" href={subredditLink}>
            {item.subreddit_name_prefixed}
          </Link>
          <span className="px-1">&bull;</span>
          <Link className="truncate hover:text-slate-800 hover:underline" href={authorLink}>
            u/{item.author}
          </Link>
        </div>
        <button
          className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-sky-200 focus:bg-sky-200 focus:outline-none"
          disabled={isPending}
          onClick={() => mutate({ saved: !item.saved })}
        >
          <Bookmark className={`stroke-sky-500 ${item.saved && "fill-sky-500"}`} />
        </button>
      </div>
      <Link className="max-w-fit truncate text-xl font-medium text-slate-800" href={postLink}>
        {item.type === "comment" ? "Comment" : item.title}
      </Link>
    </div>
  );
}
