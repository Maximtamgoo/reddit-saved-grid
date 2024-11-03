import { useResizeObserver } from "@src/hooks/useResizeObserver";
import { useWindowOuterHeight } from "@src/hooks/useWindowOuterHeight";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";

type Props<Item> = {
  items: Item[];
  maxLanes: number;
  maxLaneWidth: number;
  gap: number;
  overscan: number;
  renderLoader: ReactNode;
  getItemKey: (index: number) => string | number;
  estimateSize: (item: Item, width: number) => number;
  renderItem: (item: Item) => ReactNode;
  renderScrollTo: (scrollDirection: "backward" | "forward" | null) => ReactNode;
  loadMore: () => void;
};

export default function VirtualMasonry<Item>({
  items,
  maxLanes,
  maxLaneWidth,
  gap,
  overscan,
  renderLoader,
  getItemKey,
  estimateSize,
  renderItem,
  renderScrollTo,
  loadMore
}: Props<Item>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const parentRect = useResizeObserver(parentRef);
  const parentWidth = parentRect.width;
  const winHeight = useWindowOuterHeight();

  const lanes = useMemo(
    () => Math.max(1, Math.min(maxLanes, Math.floor(parentWidth / maxLaneWidth))),
    [parentWidth, maxLanes, maxLaneWidth]
  );

  const itemWidth = useMemo(() => {
    const numOfGaps = lanes - 1;
    const gapTotal = numOfGaps * gap;
    return Math.round((parentWidth - gapTotal) / lanes);
  }, [parentWidth, lanes, gap]);

  const percent = (100 * itemWidth) / parentWidth;

  const winVirtualizer = useWindowVirtualizer({
    enabled: parentWidth > 0,
    count: items.length,
    lanes,
    gap,
    overscan,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
    getItemKey: useCallback(
      (index: number) => getItemKey(index),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [getItemKey, parentWidth, winHeight]
    ),
    estimateSize: (index) => estimateSize(items[index], itemWidth)
  });

  const virtualItems = winVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem && lastItem.index === items.length - 1) loadMore();
  }, [virtualItems, items.length, loadMore]);

  return (
    <div ref={parentRef} className="max-w-full">
      {winVirtualizer.options.enabled && (
        <>
          <div
            className="relative w-full"
            style={{
              height: `${winVirtualizer.getTotalSize()}px`
            }}
          >
            {virtualItems.map((item) => {
              return (
                <div
                  key={item.key}
                  data-index={item.index}
                  className="absolute top-0"
                  style={{
                    transform: `translateY(${item.start - winVirtualizer.options.scrollMargin}px)`,
                    left: `calc(${item.lane} * (${percent}% + ${gap}px))`,
                    width: `${percent}%`,
                    height: `${item.size}px`
                  }}
                >
                  {renderItem(items[item.index])}
                </div>
              );
            })}
          </div>
          {renderLoader}
          {renderScrollTo(winVirtualizer.scrollDirection)}
        </>
      )}
    </div>
  );
}
