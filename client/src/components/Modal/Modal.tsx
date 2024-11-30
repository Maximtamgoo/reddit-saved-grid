import { RedditItem } from "@src/schema/RedditItem";
import ArrowLeft from "@src/svg/arrow-left.svg?react";
import ArrowRedirect from "@src/svg/square-arrow-out-up-right.svg?react";
import Link from "../Link";
import { Gallery } from "./Gallery";
import Image from "./Image";
import Playable from "./Playable";

type Props = {
  item: RedditItem;
};

export default function Modal({ item }: Props) {
  return (
    <div className="fixed inset-0 p-0.5 backdrop-blur backdrop-brightness-50">
      <form method="dialog">
        <button className="absolute left-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300">
          <ArrowLeft />
        </button>
      </form>
      {item.type === "gallery" && <Gallery items={item.gallery} />}
      {item.type === "image" && <Image url={item.source.url} />}
      {item.type === "playable" && <Playable url={item.source.url} poster={item.preview.url} />}
      <Link
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300"
        href={`https://www.reddit.com${item.permalink}`}
      >
        <ArrowRedirect />
      </Link>
    </div>
  );
}
