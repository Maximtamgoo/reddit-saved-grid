import { Post } from "@src/schema/Post";
import { useToggleBookmark } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";

type Props = {
  post: Post;
};

export default function Details({ post }: Props) {
  const { mutate } = useToggleBookmark();
  const { permalink, subreddit, author } = post;
  const postLink = `https://www.reddit.com${permalink}`;
  const subredditLink = `https://www.reddit.com/r/${subreddit}`;
  const authorLink = `https://www.reddit.com/u/${author}`;

  return (
    <div className="flex items-center gap-2 truncate border-b-4 border-zinc-900 px-2 py-1">
      <div className="grow truncate">
        <a className="hover:underline" href={subredditLink} target="_blank" rel="noreferrer">
          r/{subreddit}
        </a>
        <span className="px-1">&bull;</span>
        <a className="hover:underline" href={authorLink} target="_blank" rel="noreferrer">
          u/{author}
        </a>
        {post.type === "comment" ? (
          <a className="block truncate text-xl">Comment</a>
        ) : (
          <a className="block truncate text-xl" href={postLink} target="_blank" rel="noreferrer">
            {post.title}
          </a>
        )}
      </div>
      <button
        className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md bg-zinc-900 hover:bg-zinc-700"
        onClick={() => mutate({ id: post.id, saved: !post.saved })}
      >
        <Bookmark className={`${post.saved ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
