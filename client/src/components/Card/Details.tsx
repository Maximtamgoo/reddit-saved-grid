import { Post } from "@src/schema/Post";
import { useToggleBookmark } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import Link from "@src/components/Link";

type Props = {
  post: Post;
  pageParam: string;
};

export default function Details({ post, pageParam }: Props) {
  const { mutate } = useToggleBookmark(post.id, pageParam);
  const { permalink, subreddit, author } = post;
  const postLink = `https://www.reddit.com${permalink}`;
  const subredditLink = `https://www.reddit.com/r/${subreddit}`;
  const authorLink = `https://www.reddit.com/u/${author}`;

  return (
    <div className="grid gap-2 p-4">
      <div className="flex min-w-0">
        <div className="grow truncate text-slate-600">
          <Link className="hover:text-slate-900 hover:underline" href={subredditLink}>
            <span className="text-sm">r</span>/{subreddit}
          </Link>
          <span className="px-1">&bull;</span>
          <Link className="hover:text-slate-900 hover:underline" href={authorLink}>
            <span className="text-sm">r</span>/{author}
          </Link>
        </div>
        <div className="relative w-12 shrink-0">
          <button
            className="absolute -top-7 size-12"
            onClick={() => mutate({ saved: !post.saved })}
          >
            <Bookmark
              className={`size-full stroke-sky-500 stroke-1 hover:stroke-sky-600 ${post.saved ? "fill-sky-500" : "fill-slate-100"}`}
            />
          </button>
        </div>
      </div>
      <Link className="line-clamp-2 text-xl font-medium hover:text-slate-900" href={postLink}>
        {post.type === "comment" ? "Comment" : post.title}
      </Link>
    </div>
  );
}
