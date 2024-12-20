import { RedditItem } from "@src/schema/RedditItem";
import ArrowRedirect from "@src/svg/square-arrow-out-up-right.svg?react";
import Link from "../Link";
import { Gallery } from "./Gallery";

type Props = {
  item: RedditItem;
};

export default function Modal({ item }: Props) {
  return (
    <div className="fixed inset-0 bg-transparent/90 backdrop-blur">
      {item.type === "gallery" && <Gallery items={item.gallery} />}
      {item.type === "image" && <Gallery items={[item]} />}
      {item.type === "playable" && <Gallery items={[item]} />}
      <Link
        className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-transparent/90 text-white"
        href={`https://www.reddit.com${item.permalink}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ArrowRedirect />
      </Link>
    </div>
  );
}
