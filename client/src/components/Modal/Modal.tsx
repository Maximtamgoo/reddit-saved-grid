import { RedditItem } from "@src/schema/RedditItem";
import ArrowLeft from "@src/svg/arrow-left.svg?react";
import ArrowRedirect from "@src/svg/square-arrow-out-up-right.svg?react";
import Link from "../Link";
import { Gallery } from "./Gallery";

type Props = {
  item: RedditItem;
};

export default function Modal({ item }: Props) {
  const postLink = `https://www.reddit.com${item.permalink}`;

  return (
    <div className="fixed inset-0 bg-slate-50">
      {item.type === "gallery" && <Gallery urls={item.gallery.map((e) => e.u ?? "")} />}
      {item.type === "image" && <Gallery urls={[item.source.url]} />}
      <form method="dialog">
        <button className="absolute left-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300">
          <ArrowLeft />
        </button>
      </form>
      <Link
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300"
        href={postLink}
      >
        <ArrowRedirect />
      </Link>
    </div>
  );
}
