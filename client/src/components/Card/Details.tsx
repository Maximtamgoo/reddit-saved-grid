import { Post } from "@src/schema/Post";
import { useToggleBookmark } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";

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
    <div className="flex items-center gap-2 p-2">
      <div className="grow overflow-hidden">
        <div className="truncate">
          <a className="hover:underline" href={subredditLink} target="_blank" rel="noreferrer">
            <span className="text-sm">r</span>/{subreddit}
          </a>
          <span className="px-1">&bull;</span>
          <a className="hover:underline" href={authorLink} target="_blank" rel="noreferrer">
            <span className="text-sm">u</span>/{author}
          </a>
        </div>
        <a className="line-clamp-2 text-xl" href={postLink} target="_blank" rel="noreferrer">
          {post.type === "comment" ? "Comment" : post.title}
        </a>
      </div>
      <button
        className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md bg-zinc-900 hover:bg-zinc-700"
        onClick={() => mutate({ saved: !post.saved })}
      >
        <Bookmark className={`${post.saved ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
