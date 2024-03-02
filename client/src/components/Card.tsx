import type { Post } from "../utils/trimRedditListing";

export default function Card({ post }: { post: Post }) {
  if (!post.url) {
    return (
      <div className="grid aspect-square place-items-center rounded-md bg-zinc-800 text-9xl">?</div>
    );
  }

  return (
    <div className="relative flex justify-center overflow-hidden rounded-md bg-zinc-800 object-contain">
      <img
        className="object-contain"
        // onLoad={onLoad}
        src={post.url}
        alt="Reddit Content"
        // style={{ filter: loading ? "blur(5px)" : "blur(0)" }}
      />
      {post.isGallery && (
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md bg-inherit text-lg">
          {post.galleryLength}
        </div>
      )}
    </div>
  );
}
