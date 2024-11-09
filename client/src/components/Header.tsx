import Link from "@src/components/Link";
import { signOut } from "@src/services/api";
import { useGetSignedInUser } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";

export default function Header() {
  const { data, isSuccess } = useGetSignedInUser();

  return (
    <header className="m-auto flex h-16 max-w-screen-2xl items-center pl-1 pr-3 text-slate-800">
      <Bookmark className="size-10 shrink-0 fill-sky-500 stroke-sky-500" />
      <span className="grow truncate text-3xl">Reddit Saved Masonry</span>
      <nav className="flex gap-2">
        <Link
          className="grid size-10 place-items-center overflow-hidden rounded-full bg-slate-100 hover:bg-slate-200"
          href={`https://www.reddit.com/user/${data?.name}/saved`}
        >
          {isSuccess && <img src={data.icon_img} />}
        </Link>
        <Link
          className="grid size-10 place-items-center overflow-hidden rounded-full bg-slate-100 hover:bg-slate-200"
          href="https://github.com/Maximtamgoo/reddit-saved-masonry"
        >
          <Github />
        </Link>
        <button
          className="grid size-10 place-items-center overflow-hidden rounded-full bg-slate-100 hover:bg-slate-200"
          onClick={async () => {
            await signOut();
            window.location.reload();
          }}
        >
          <LogOut />
        </button>
      </nav>
    </header>
  );
}
