import { useEffect, useMemo } from "react";
import { useGetSavedContent } from "../services/queries";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Card from "../components/Card";
import ThreeDots from "../svg/three-dots.svg?react";
import useWindowWidth from "../hooks/useWindowWidth";
// import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { useInView } from "react-intersection-observer";

const ITEM_SIZE = 400;
const MAX_LANES = 3;
const MIN_LANES = 2;

export default function MainPage({ username }: { username: string }) {
  const width = useWindowWidth();
  // const targetRef = useRef(null);
  // const isIntersecting = useIntersectionObserver(targetRef, {
  //   rootMargin: "75%"
  //   // threshold: 1
  // });
  // console.log("isIntersecting:", isIntersecting);

  const { ref, inView } = useInView();

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetched } =
    useGetSavedContent(username);
  // console.log("data:", data?.pages[0].posts[1]);

  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) ?? [];
  }, [data]);

  const lanes = useMemo(
    () => Math.max(MIN_LANES, Math.min(MAX_LANES, Math.floor(width / ITEM_SIZE))),
    [width]
  );

  const winVirtualizer = useWindowVirtualizer({
    count: allItems.length,
    // count: hasNextPage ? allItems.length + 1 : allItems.length,
    estimateSize: () => ITEM_SIZE,
    overscan: lanes * 2,
    lanes
  });

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  if (isError) return <div>isError main</div>;
  // if (isPending) return <div>isPending main</div>;

  if (isLoading) {
    return (
      <main className="absolute inset-0 top-16 grid place-items-center bg-zinc-900">
        <ThreeDots className="fill-blue-500" />
      </main>
    );
  }

  // const maxWidth = Math.floor(100 / (width / (ITEM_SIZE * MAX_LANES)));
  // console.log("maxWidth:", maxWidth);

  return (
    <main className="bg-zinc-900 text-blue-500">
      <div
        style={{
          height: `${winVirtualizer.getTotalSize()}px`,
          margin: "0 auto",
          maxWidth: `${ITEM_SIZE * MAX_LANES}px`,
          // maxWidth: `${maxWidth}%`,
          position: "relative"
        }}
      >
        {winVirtualizer.getVirtualItems().map(({ index, lane, start }) => {
          const post = allItems[index];
          const percent = 100 / lanes;
          // const isLoaderItem = index > allItems.length - 1;

          return (
            <div
              className="p-1.5"
              key={post.id}
              ref={winVirtualizer.measureElement}
              data-index={index}
              style={{
                position: "absolute",
                top: 0,
                left: `${lane * percent}%`,
                width: `${percent}%`,
                transform: `translateY(${start}px)`
              }}
            >
              <Card post={post} />
            </div>
          );
        })}
      </div>
      {isFetched && (
        <div ref={ref} className="grid h-20 place-items-center">
          {hasNextPage ? <ThreeDots className="fill-blue-500" /> : "The End"}
        </div>
      )}
    </main>
  );
}
