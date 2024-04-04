import { Post } from "../../schema/Post";

type Props = {
  post: Post;
};

export default function Details({ post }: Props) {
  const { permalink, subreddit, author } = post;
  const postLink = `https://www.reddit.com${permalink}`;
  const subredditLink = `https://www.reddit.com/r/${subreddit}`;
  const authorLink = `https://www.reddit.com/u/${author}`;

  return (
    <>
      <div className="truncate">
        <a className="hover:underline" href={subredditLink} target="_blank" rel="noreferrer">
          r/{subreddit}
        </a>
        <span className="px-1">&bull;</span>
        <a className="hover:underline" href={authorLink} target="_blank" rel="noreferrer">
          u/{author}
        </a>
      </div>
      {post.type === "comment" ? (
        <a className="block truncate text-xl">Comment</a>
      ) : (
        <a className="block truncate text-xl" href={postLink} target="_blank" rel="noreferrer">
          {post.title} {post.title} {post.title}
        </a>
      )}
    </>
  );
}
