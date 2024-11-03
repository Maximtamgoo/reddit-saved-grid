import Card from "@src/components/Card/Card";
import VirtualMasonry from "@src/components/VirtualMasonry";
import { RedditItem } from "@src/schema/RedditItem";
import { useGetSavedContent } from "@src/services/queries";
import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { calculateAspectRatioFit } from "@src/utils/calculateAspectRatioFit";
import { useCallback, useMemo, useRef } from "react";

const isMaybeMobile = "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

export default function MainPage() {
  const isBusyRef = useRef(false);
  const { data, isPending, isError, error, isLoadingError, hasNextPage, fetchNextPage } =
    useGetSavedContent();

  const redditItems = useMemo(() => data?.pages.flatMap((page) => page.redditItems) ?? [], [data]);

  const estimateSize = useCallback((item: RedditItem, width: number) => {
    const minHeight = 350;
    const winHeight = isMaybeMobile ? window.outerHeight : window.innerHeight;
    const maxHeight = winHeight - 40;
    const detailsHeight = 100;
    let totalHeight = detailsHeight;

    if (item.type === "gallery") {
      const p = item.preview;
      const h = Math.round(calculateAspectRatioFit(p.x, p.y, width, p.y).height);
      totalHeight += h;
    } else if (item.type === "image") {
      const p = item.preview;
      totalHeight += Math.round(calculateAspectRatioFit(p.width, p.height, width, p.height).height);
    }

    return Math.max(minHeight, Math.min(maxHeight, totalHeight));
  }, []);

  const loadMore = useCallback(async () => {
    if (!isBusyRef.current && hasNextPage) {
      isBusyRef.current = true;
      await fetchNextPage();
      isBusyRef.current = false;
    }
  }, [hasNextPage, fetchNextPage]);

  if (isLoadingError) {
    return (
      <main className="absolute inset-0 grid place-content-center justify-items-center gap-2 text-slate-800">
        <div className="text-xl">{error.message}</div>
      </main>
    );
  }

  if (isError) {
    console.log("error:", error);
    return <div>{error.message}</div>;
  }

  if (isPending) {
    return (
      <main className="absolute inset-0 grid place-content-center justify-items-center gap-2 text-slate-800">
        <LoaderCircle className="size-14 animate-spin rounded-full" />
        <div className="text-xl">Getting Posts</div>
      </main>
    );
  }

  return (
    <main className="p-2 text-slate-800">
      <div className="m-auto max-w-screen-2xl">
        <VirtualMasonry
          items={redditItems}
          maxLanes={3}
          maxLaneWidth={350}
          gap={20}
          overscan={20}
          getItemKey={(index) => redditItems[index].id ?? index}
          estimateSize={estimateSize}
          loadMore={loadMore}
          renderItem={(item) => <Card item={item} />}
          renderLoader={
            <div className="grid h-24 place-items-center text-xl">
              {hasNextPage ? (
                <LoaderCircle className="size-14 animate-spin" />
              ) : (
                "Reached the Reddit limit..."
              )}
            </div>
          }
        />
      </div>
    </main>
  );
}
