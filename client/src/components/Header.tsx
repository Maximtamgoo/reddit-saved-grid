import User from "@src/svg/user.svg?react";
import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";
import DropdownMenu from "./DropdownMenu";
import { signOut } from "@src/services/api";
import { ITEM_SIZE, MAX_LANES } from "@src/constant";
import useWindowWidth from "@src/hooks/useWindowWidth";

export default function Header({ username }: { username: string }) {
  const width = useWindowWidth();
  return (
    <header className="sticky top-0 z-10 border-b-2 border-blue-500 bg-zinc-900 text-blue-500">
      <div
        className="mx-auto flex items-center justify-between px-2 py-1"
        style={{
          maxWidth: width < ITEM_SIZE * MAX_LANES ? "100%" : "90%"
        }}
      >
        <div className="truncate text-3xl">Reddit Saved Masonry</div>
        <DropdownMenu>
          <a
            className="flex items-center gap-2 rounded-md bg-zinc-900 p-2"
            href="https://github.com/Maximtamgoo/reddit-saved-masonry"
            target="_blank"
            rel="noreferrer"
          >
            <Github /> Github
          </a>
          <a
            className="flex items-center gap-2 rounded-md bg-zinc-900 p-2"
            href={`https://www.reddit.com/user/${username}/saved/`}
            target="_blank"
            rel="noreferrer"
          >
            <User /> Profile
          </a>
          <button
            className="flex items-center gap-2 rounded-md bg-zinc-900 p-2"
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            <LogOut /> Sign Out
          </button>
        </DropdownMenu>
      </div>
    </header>
  );
}
