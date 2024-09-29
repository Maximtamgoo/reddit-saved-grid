import { Post } from "@src/schema/Post";
import { memo } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import Details from "./Details";
import Preview from "./Preview";
import Text from "./Text";

type Props = {
  post: Post;
};

export default memo(function Card({ post }: Props) {
  const navigate = useBrowserLocation()[1];
  const onClick = () => navigate(`/modal/${post.id}`, { state: post });

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg shadow-md shadow-slate-400 ring-slate-200 focus-within:ring-slate-300 hover:ring-slate-300">
      <Details post={post} />
      {post.type === "text" && <Text text={post.text} />}
      {post.type === "comment" && <Text text={post.comment} />}
      {post.type === "gallery" && (
        <Preview url={post.preview.url} galleryLength={post.gallery.length} onClick={onClick} />
      )}
      {post.type === "image" && (
        <Preview url={post.preview.url} isGif={post.isGif} onClick={onClick} />
      )}
      {post.type === "unknown" && <div className="grid grow place-items-center text-8xl">?</div>}
    </section>
  );
});
