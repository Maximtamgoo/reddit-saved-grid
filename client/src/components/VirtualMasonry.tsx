import { useMemo, useCallback, useLayoutEffect, ReactNode, memo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import useWindowWidth from "@src/hooks/useWindowWidth";
import { Post } from "@src/schema/Post";
import { ITEM_SIZE, MIN_LANES, MAX_LANES } from "@src/constant";

type Props = {
  items: Post[];
  children: (item: Post, index: number) => ReactNode;
};

export default memo(function VirtualMasonry({ items, children }: Props) {
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
      className="relative m-auto max-w-full 2xl:max-w-[90%]"
      style={{
        height: `${winVirtualizer.getTotalSize()}px`
      }}
    >
      {winVirtualizer.getVirtualItems().map(({ index, lane, start, key }) => {
        return (
          <li
            className="absolute top-0 p-2 2xl:p-4"
            key={key}
            ref={winVirtualizer.measureElement}
            data-index={index}
            style={{
              left: `${lane * percent}%`,
              width: `${percent}%`,
              transform: `translateY(${start}px)`
            }}
          >
            {children(items[index], index)}
          </li>
        );
      })}
    </ul>
  );
});
