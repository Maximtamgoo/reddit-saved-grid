import { RefObject, useLayoutEffect, useState } from "react";

type Rect = Omit<DOMRectReadOnly, "toJSON">;

const defaultState: Rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};

export function useResizeObserver(ref: RefObject<HTMLElement>) {
  const [rect, setRect] = useState(defaultState);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setRect(entry.contentRect));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return rect;
}
