import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";
import Bookmark from "@src/svg/bookmark.svg?react";
import Link from "@src/components/Link";
import { useUser } from "@src/services/queries";
import { signOut } from "@src/services/api";

export default function Header() {
  const user = useUser();
  const className =
    "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 hover:ring-2 hover:ring-slate-300";
  return (
    <header className="sticky top-0 z-10 border-b-2 border-slate-300 bg-slate-50 p-2 text-slate-800 2xl:px-4">
      <div className="mx-auto flex max-w-full items-center justify-between 2xl:max-w-[90%]">
        <Bookmark className="size-10 shrink-0" />
        <span className="grow truncate text-xl sm:text-3xl">Reddit Saved Masonry</span>
        <nav className="flex gap-2 px-2">
          <Link className={className} href={`https://www.reddit.com/user/${user?.name}/saved/`}>
            <img src={user?.icon_img} />
          </Link>
          <Link className={className} href="https://github.com/Maximtamgoo/reddit-saved-masonry">
            <Github />
          </Link>
          <Link
            className={className}
            onClick={async (e) => {
              e.preventDefault();
              await signOut();
              window.location.reload();
            }}
          >
            <LogOut />
          </Link>
        </nav>
      </div>
    </header>
  );
}
