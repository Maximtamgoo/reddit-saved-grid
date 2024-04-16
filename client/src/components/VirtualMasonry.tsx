import { useMemo, useCallback, useLayoutEffect, ReactNode } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import useWindowWidth from "@src/hooks/useWindowWidth";
import { Post } from "@src/schema/Post";

const ITEM_SIZE = 400;
const MAX_LANES = 3;
const MIN_LANES = 1;

type Props = {
  items: Post[];
  children: (item: Post) => ReactNode;
};

export default function VirtualMasonry({ items, children }: Props) {
  const width = useWindowWidth();
  const lanes = useMemo(
    () => Math.max(MIN_LANES, Math.min(MAX_LANES, Math.floor(width / ITEM_SIZE))),
    [width]
  );
  const percent = 100 / lanes;

  const winVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: useCallback(() => ITEM_SIZE, []),
    overscan: 20,
    lanes,
    getItemKey: useCallback((index: number) => items[index].id, [items])
  });

  useLayoutEffect(() => {
    if (lanes) winVirtualizer.measure();
  }, [lanes, winVirtualizer]);

  return (
    <ul
      className="relative mx-auto"
      style={{
        height: `${winVirtualizer.getTotalSize()}px`,
        maxWidth: lanes < MAX_LANES ? "100%" : "90%"
      }}
    >
      {winVirtualizer.getVirtualItems().map(({ index, lane, start, key }) => {
        return (
          <li
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
            {children(items[index])}
          </li>
        );
      })}
    </ul>
  );
}
