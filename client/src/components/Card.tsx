import type { Post } from "../utils/trimRedditListing";

export default function Card({ post }: { post: Post }) {
  if (!post.url) {
    return <div className="grid place-items-center rounded-md bg-zinc-700 p-16 text-9xl">?</div>;
  }

  return (
    <div className="relative flex justify-center overflow-hidden rounded-md bg-zinc-700">
      <img
        // onLoad={onLoad}
        src={post.url}
        alt="Reddit Content"
        // style={{ filter: loading ? "blur(5px)" : "blur(0)" }}
      />
      {post.isGallery && (
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md bg-zinc-900 text-lg">
          {post.galleryLength}
        </div>
      )}
    </div>
  );
}
