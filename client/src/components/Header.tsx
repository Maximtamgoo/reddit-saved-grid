import Link from "@src/components/Link";
import { signOut } from "@src/services/api";
import { useGetSignedInUser } from "@src/services/queries";
import Bookmark from "@src/svg/bookmark.svg?react";
import Github from "@src/svg/github.svg?react";
import LogOut from "@src/svg/log-out.svg?react";

export default function Header() {
  const { data, isSuccess } = useGetSignedInUser();
  const className =
    "grid size-10 place-items-center overflow-hidden rounded-full text-slate-800 ring-2 ring-slate-200 hover:bg-slate-100 hover:ring-slate-300";

  return (
    <header className="sticky top-0 z-10 m-auto h-16 max-w-[1650px] border-b-2 border-slate-200 bg-white">
      <div className="m-auto flex h-full max-w-screen-2xl items-center">
        <Bookmark className="size-12 shrink-0 fill-sky-500 stroke-sky-500" />
        <span className="grow truncate text-3xl">Reddit Saved Masonry</span>
        <nav className="flex gap-2 pr-4">
          <Link className={className} href={`https://www.reddit.com/user/${data?.name}/saved`}>
            {isSuccess && <img src={data.icon_img} />}
          </Link>
          <Link className={className} href="https://github.com/Maximtamgoo/reddit-saved-masonry">
            <Github />
          </Link>
          <button
            className={className}
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            <LogOut />
          </button>
        </nav>
      </div>
    </header>
  );
}
