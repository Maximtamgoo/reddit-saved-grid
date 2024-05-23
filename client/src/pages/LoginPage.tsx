import Bookmark from "@src/svg/bookmark.svg?react";

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col items-center gap-10 bg-slate-50 p-4 pt-32 text-center text-slate-700">
      <div className="text-4xl">
        <Bookmark className="inline-block size-10 shrink-0 fill-sky-500 stroke-sky-500" />
        Reddit Saved Masonry
      </div>
      <button
        className="h-12 w-44 rounded-md bg-slate-200 hover:ring-2 hover:ring-slate-300"
        onClick={() => (window.location.href = "/api/authurl")}
      >
        Login with Reddit
      </button>
      View your saved Reddit posts in a masonry grid.
    </div>
  );
}
