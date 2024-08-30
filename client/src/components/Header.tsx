import Link from "@src/components/Link";
import { signOut } from "@src/services/api";
import { useGetSignedInUser } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";

export default function Header() {
  const { data, isSuccess } = useGetSignedInUser();
  const className =
    "grid sm:size-12 size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 hover:ring-2 hover:ring-slate-300";
  return (
    <header className="sticky top-0 z-10 h-16 border-b-2 border-slate-300 bg-slate-50 text-slate-800">
      <div className="m-auto flex h-full max-w-screen-2xl items-center justify-between">
        <Bookmark className="size-10 shrink-0 sm:size-12" />
        <span className="grow truncate text-2xl sm:text-3xl">Reddit Saved Masonry</span>
        <nav className="flex gap-2 pr-2">
          <Link className={className} href={`https://www.reddit.com/user/${data?.name}/saved/`}>
            {isSuccess && <img src={data.icon_img} />}
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
