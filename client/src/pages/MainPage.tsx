import Card from "@src/components/Card/Card";
import VirtualMasonry from "@src/components/VirtualMasonry";
import { Post } from "@src/schema/Post";
import { useGetSavedContent } from "@src/services/queries";
import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { calculateAspectRatioFit } from "@src/utils/calculateAspectRatioFit";
import { useCallback, useMemo, useRef } from "react";

export default function MainPage() {
  const isBusyRef = useRef(false);
  const { data, isPending, isError, error, hasNextPage, fetchNextPage } = useGetSavedContent();

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

  const estimateSize = useCallback((item: Post, width: number) => {
    const post = item;
    const detailsHeight = 96;
    const minHeight = 350;
    const maxHeight = window.innerHeight - 90;

    if (post.type === "gallery" || post.type === "image") {
      const ratioSize = calculateAspectRatioFit(
        post.preview.width,
        post.preview.height,
        width,
        post.preview.height
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
    <main className="bg-slate-50 text-slate-800">
      <div className="m-auto max-w-screen-2xl px-2 py-5">
        <VirtualMasonry
          items={posts}
          maxLanes={3}
          laneWidth={350}
          gap={20}
          overscan={20}
          getItemKey={getItemKey}
          estimateSize={estimateSize}
          loadMore={loadMore}
          renderItem={(item) => <Card post={item} />}
          renderLoader={
            <div className="grid h-20 place-items-center text-xl">
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
