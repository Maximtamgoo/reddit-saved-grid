import User from "@src/svg/user.svg?react";
import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";
import { signOut } from "@src/services/api";

export default function Header({ username }: { username: string }) {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-blue-500 bg-zinc-900 p-2 text-blue-500 2xl:px-4">
      <div className="m-auto flex max-w-full justify-between gap-2 2xl:max-w-[90%]">
        <div className="self-center truncate text-3xl">Reddit Saved Masonry</div>
        <nav className="flex gap-2">
          <a
            className="size-10 rounded-full bg-zinc-800 hover:bg-zinc-700"
            href="https://github.com/Maximtamgoo/reddit-saved-masonry"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="size-full p-2" />
          </a>
          <a
            className="size-10 rounded-full bg-zinc-800 hover:bg-zinc-700"
            href={`https://www.reddit.com/user/${username}/saved/`}
            target="_blank"
            rel="noreferrer"
          >
            <User className="size-full p-2" />
          </a>
          <button
            className="size-10 rounded-full bg-zinc-800 hover:bg-zinc-700"
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            <LogOut className="size-full p-2" />
          </button>
        </nav>
      </div>
    </header>
  );
}
