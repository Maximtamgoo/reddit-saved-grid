import { useResizeObserver } from "@src/hooks/useResizeObserver";
import useWindowHeight from "@src/hooks/useWindowHeight";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef } from "react";

type Props<Item> = {
  items: Item[];
  maxLanes: number;
  laneWidth: number;
  gap: number | number[];
  overscan: number;
  renderLoader: ReactNode;
  getItemKey: (index: number) => string | number;
  estimateSize: (item: Item, width: number) => number;
  renderItem: (item: Item) => ReactNode;
  loadMore: () => void;
};

export default function VirtualMasonry<Item>({
  items,
  maxLanes,
  laneWidth,
  gap,
  overscan,
  renderLoader,
  getItemKey,
  estimateSize,
  renderItem,
  loadMore
}: Props<Item>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const parentRect = useResizeObserver(parentRef);
  const parentWidth = parentRect.width;
  const deferredWidth = useDeferredValue(parentWidth);
  const winHeight = useWindowHeight();
  const deferredWinHeight = useDeferredValue(winHeight);

  const lanes = useMemo(
    () => Math.max(1, Math.min(maxLanes, Math.floor(parentWidth / laneWidth))),
    [parentWidth, maxLanes, laneWidth]
  );

  const chosenGap = useMemo(() => (Array.isArray(gap) ? gap[lanes - 1] : gap), [lanes, gap]);

  const itemWidth = useMemo(() => {
    const numOfGaps = lanes - 1;
    const gapTotal = numOfGaps * chosenGap;
    return Math.round((parentWidth - gapTotal) / lanes);
  }, [parentWidth, lanes, chosenGap]);

  const percent = (100 * itemWidth) / parentWidth;

  const winVirtualizer = useWindowVirtualizer({
    enabled: parentWidth > 0,
    count: items.length,
    lanes,
    gap: chosenGap,
    overscan,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
    getItemKey,
    estimateSize: (index) => estimateSize(items[index], itemWidth)
  });

  const virtualItems = winVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem && lastItem.index === items.length - 1) loadMore();
  }, [virtualItems, items.length, loadMore]);

  useLayoutEffect(() => {
    if (deferredWidth > 0) winVirtualizer.measure();
  }, [winVirtualizer, deferredWidth, deferredWinHeight]);

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
                    left: `calc(${item.lane} * (${percent}% + ${chosenGap}px))`,
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
        </>
      )}
    </div>
  );
}
