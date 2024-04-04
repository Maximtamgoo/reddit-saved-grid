import { ReactNode, createPortal, useEffect } from "react";
import { Post } from "../../schema/Post";
import X from "../../svg/x.svg?react";
import { Gallery } from "./Gallery";
// import Source from "./Source";

type Props = {
  post: Post;
  onClose: () => void;
};

export default function Modal({ post, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => e.code === "Escape" && onClose();
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  let Post: ReactNode = null;

  if (post.type === "gallery") {
    Post = <Gallery urls={post.gallery} />;
  } else if (post.type === "image") {
    Post = <Gallery urls={[post.source]} />;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/95 p-2">
      {Post}
      <button
        onClick={() => onClose()}
        className="absolute right-2 top-2 grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-black/40 text-blue-500"
      >
        <X className="h-full w-full" />
      </button>
    </div>,
    document.body
  );
}
