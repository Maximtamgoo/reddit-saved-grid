import Github from "../svg/github.svg?react";
import { signOut } from "../services/api";

export default function Navbar({ username }: { username: string }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b-2 border-blue-500 bg-zinc-900 p-1 text-blue-500">
      <div className="grid grow place-content-center justify-start">
        <div className="truncate text-2xl">Reddit Saved Masonry</div>
        <div className="truncate text-base">u/{username}</div>
      </div>
      <a
        className="grid h-12 w-12 shrink-0 place-items-center rounded-md border-2 border-inherit"
        href="https://github.com/Maximtamgoo/reddit-saved-masonry"
        target="_blank"
        rel="noreferrer"
      >
        <Github />
      </a>
      <button
        className="h-12 shrink-0 rounded-md border-2 border-inherit px-3 text-base"
        onClick={() => {
          signOut();
          document.cookie = "";
          window.location.reload();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
