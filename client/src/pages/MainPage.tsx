import { useMemo } from "react";
import { useGetSavedContent } from "../services/queries";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Card from "../components/Card";
import useWindowWidth from "../hooks/useWindowWidth";

const ITEM_SIZE = 350;
const MAX_LANES = 4;
const MIN_LANES = 2;

export default function MainPage({ username }: { username: string }) {
  const { data, isPending, isError } = useGetSavedContent(username);

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
    estimateSize: () => ITEM_SIZE,
    overscan: 10,
    lanes
  });

  if (isError) return <div>isError main</div>;
  if (isPending) return <div>isPending main</div>;

  const gap = lanes === MIN_LANES ? "p-1" : "p-2";

  return (
    <main
      className="bg-zinc-900 text-blue-500"
      style={{
        margin: "0 auto",
        maxWidth: `${ITEM_SIZE * MAX_LANES}px`
      }}
    >
      <div
        style={{
          height: `${winVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative"
        }}
      >
        {winVirtualizer.getVirtualItems().map((virtualItem) => {
          const post = allItems[virtualItem.index];
          const percent = 100 / lanes;
          return (
            <div
              className={gap}
              key={post.id}
              ref={winVirtualizer.measureElement}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                // TODO try more fluid lanes and horizontal gaps
                left: `${virtualItem.lane * percent}%`,
                width: `${percent}%`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <Card post={post} />
            </div>
          );
        })}
      </div>
      {/* <div className="absolute bottom-0 grid place-items-center h-10 bg-blue-700">loading</div> */}
    </main>
  );
}
