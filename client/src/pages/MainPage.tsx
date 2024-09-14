import Card from "@src/components/Card/Card";
import VirtualMasonry from "@src/components/VirtualMasonry";
import { Post } from "@src/schema/Post";
import { useGetSavedContent } from "@src/services/queries";
import ChevronLeft from "@src/svg/chevron-left.svg?react";
import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { calculateAspectRatioFit } from "@src/utils/calculateAspectRatioFit";
import { useCallback, useMemo, useRef } from "react";

const isMaybeMobile = "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

export default function MainPage() {
  const showRef = useRef(false);
  const isBusyRef = useRef(false);
  const { data, isPending, isError, error, isLoadingError, hasNextPage, fetchNextPage } =
    useGetSavedContent();

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

  const estimateSize = useCallback((item: Post, width: number) => {
    const detailsHeight = 96;
    const minHeight = 350;
    const maxHeight = isMaybeMobile ? window.outerHeight - 100 : window.innerHeight - 100;

    if (item.type === "gallery" || item.type === "image") {
      const ratioSize = calculateAspectRatioFit(
        item.preview.width,
        item.preview.height,
        width,
        item.preview.height
      );
      const ratioSizeHeight = Math.round(ratioSize.height);
      return Math.max(minHeight, Math.min(maxHeight, ratioSizeHeight + detailsHeight));
    }
    return minHeight;
  }, []);

  const getItemKey = useCallback((index: number) => posts[index].id ?? index, [posts]);

  const loadMore = useCallback(async () => {
    if (!isBusyRef.current && hasNextPage) {
      isBusyRef.current = true;
      await fetchNextPage();
      isBusyRef.current = false;
    }
  }, [hasNextPage, fetchNextPage]);

  if (isLoadingError) {
    return (
      <main className="absolute inset-0 grid place-content-center justify-items-center gap-2 bg-slate-50 text-slate-800">
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
      <main className="absolute inset-0 grid place-content-center justify-items-center gap-2 bg-slate-50 text-slate-800">
        <LoaderCircle className="size-14 animate-spin rounded-full" />
        <div className="text-xl">Getting Posts</div>
      </main>
    );
  }

  return (
    <main className="text-slate-800">
      <div className="m-auto max-w-screen-2xl px-2 pt-3">
        <VirtualMasonry
          items={posts}
          maxLanes={3}
          maxLaneWidth={350}
          gap={20}
          overscan={20}
          getItemKey={getItemKey}
          estimateSize={estimateSize}
          loadMore={loadMore}
          renderItem={(item) => <Card post={item} />}
          renderLoader={
            <div className="grid h-24 place-items-center text-xl">
              {hasNextPage ? (
                <LoaderCircle className="size-14 animate-spin" />
              ) : (
                "Reached the Reddit limit..."
              )}
            </div>
          }
          renderScrollTo={(scrollDirection) => {
            if (scrollDirection !== null) showRef.current = scrollDirection === "backward";
            return (
              <button
                className="fixed bottom-5 right-5 grid size-10 rotate-90 place-items-center rounded-full bg-slate-200 text-slate-800 hover:ring-2 hover:ring-slate-300"
                style={{ visibility: showRef.current ? "visible" : "hidden" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ChevronLeft />
              </button>
            );
          }}
        />
      </div>
    </main>
  );
}
