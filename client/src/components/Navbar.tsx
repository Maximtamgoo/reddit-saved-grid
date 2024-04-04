import Github from "../svg/github.svg?react";
import { signOut } from "../services/api";

export default function Navbar({ username }: { username: string }) {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b-2 border-blue-500 bg-zinc-900 px-2 text-blue-500">
      <div className="grid grow">
        <div className="truncate text-2xl">Reddit Saved Masonry</div>
        <a
          className="w-fit truncate hover:underline"
          href={`https://www.reddit.com/user/${username}/saved/`}
          target="_blank"
          rel="noreferrer"
        >
          u/{username}
        </a>
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
        className="h-12 w-24 shrink-0 rounded-md border-2 border-inherit"
        onClick={async () => {
          await signOut();
          window.location.reload();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
