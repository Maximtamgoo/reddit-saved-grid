import Link from "@src/components/Link";
import { useGetSignedInUser, useSignOut } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";

export default function Header() {
  const { data, isSuccess } = useGetSignedInUser();
  const { mutate } = useSignOut();

  return (
    <header className="m-auto flex h-16 max-w-screen-2xl items-center pl-1 pr-3 text-slate-800">
      <Bookmark className="size-10 shrink-0 fill-sky-500 stroke-sky-500" />
      <span className="grow truncate text-3xl">Reddit Saved Masonry</span>
      <nav className="flex gap-2">
        <Link
          className="grid size-10 place-items-center rounded-full bg-sky-50 hover:bg-sky-100"
          href={`https://www.reddit.com/user/${data?.name}/saved`}
        >
          {isSuccess && (
            <img className="size-8 rounded-full hover:bg-sky-100" src={data.icon_img} />
          )}
        </Link>
        <Link
          className="grid size-10 place-items-center rounded-full bg-sky-50 hover:bg-sky-100"
          href="https://github.com/Maximtamgoo/reddit-saved-masonry"
        >
          <Github />
        </Link>
        <button
          className="grid size-10 place-items-center rounded-full bg-sky-50 hover:bg-sky-100"
          onClick={() => mutate()}
        >
          <LogOut />
        </button>
      </nav>
    </header>
  );
}
