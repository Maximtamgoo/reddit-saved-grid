import { useMemo, useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { useGetSavedContent } from "../services/queries";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Card from "../components/Card/Card";
import ThreeDots from "../svg/three-dots.svg?react";
import useWindowWidth from "../hooks/useWindowWidth";
import { useInView } from "react-intersection-observer";
import Modal from "../components/Modal/Modal";
import { Post } from "../schema/Post";

const ITEM_SIZE = 400;
const MAX_LANES = 3;
const MIN_LANES = 1;

export default function MainPage({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalDataRef = useRef<Post>();

  const { ref, inView } = useInView();

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetched } =
    useGetSavedContent(username);

  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) ?? [];
  }, [data]);

  const width = useWindowWidth();

  const lanes = useMemo(
    () => Math.max(MIN_LANES, Math.min(MAX_LANES, Math.floor(width / ITEM_SIZE))),
    [width]
  );

  const winVirtualizer = useWindowVirtualizer({
    count: allItems.length,
    estimateSize: useCallback(() => ITEM_SIZE, []),
    overscan: 20,
    lanes,
    getItemKey: useCallback((index: number) => allItems[index].id, [allItems])
  });

  useLayoutEffect(() => {
    if (lanes) winVirtualizer.measure();
  }, [lanes, winVirtualizer]);

  const onClickPreview = useCallback((post: Post) => {
    modalDataRef.current = post;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  if (isError) {
    console.log("error:", error);
    return <div>{error}</div>;
  }

  if (isLoading) {
    return (
      <main className="absolute inset-0 grid place-items-center bg-zinc-900">
        <ThreeDots className="fill-blue-500" />
      </main>
    );
  }

  return (
    <main className="bg-zinc-900 text-blue-500">
      {isOpen && modalDataRef.current && (
        <Modal post={modalDataRef.current} onClose={() => setIsOpen(false)} />
      )}
      <div
        className="relative mx-auto"
        style={{
          height: `${winVirtualizer.getTotalSize()}px`,
          maxWidth: lanes < MAX_LANES ? "100%" : "90%"
        }}
      >
        {winVirtualizer.getVirtualItems().map(({ index, lane, start, key }) => {
          const item = allItems[index];
          const percent = 100 / lanes;

          return (
            <div
              className="absolute top-0 p-2"
              key={key}
              ref={winVirtualizer.measureElement}
              data-index={index}
              style={{
                left: `${lane * percent}%`,
                width: `${percent}%`,
                transform: `translateY(${start}px)`
              }}
            >
              <Card post={item} onClickPreview={onClickPreview} />
            </div>
          );
        })}
      </div>
      {isFetched && (
        <div ref={ref} className="grid h-20 place-items-center text-lg">
          {hasNextPage ? <ThreeDots className="fill-blue-500" /> : "The End?"}
        </div>
      )}
    </main>
  );
}
