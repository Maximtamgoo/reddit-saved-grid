import { useMemo, useEffect } from "react";
import { useInView } from "@src/hooks/useInView";
import { useGetSavedContent } from "@src/services/queries";
import VirtualMasonry from "@src/components/VirtualMasonry";
import Card from "@src/components/Card/Card";
import LoaderCircle from "@src/svg/loader-circle.svg?react";

export default function MainPage() {
  const { ref, inView } = useInView();
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage } = useGetSavedContent();

  const { posts, pageParams } = useMemo(() => {
    const pageParams: string[] = [];
    const posts =
      data?.pages.flatMap((page, i) => {
        return page.posts.map((post) => {
          pageParams.push(data.pageParams[i] as string);
          return post;
        });
      }) ?? [];
    return { posts, pageParams };
  }, [data]);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  if (isError) {
    console.log("error:", error);
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return (
      <main className="absolute inset-0 grid place-content-center justify-items-center gap-2 bg-slate-50 text-slate-800">
        <LoaderCircle className="size-14 animate-spin rounded-full" />
        <div className="text-xl">Getting Posts</div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 p-2 text-slate-800">
      <VirtualMasonry items={posts}>
        {(item, i) => <Card post={item} pageParam={pageParams[i]} />}
      </VirtualMasonry>
      <div ref={ref} className="grid h-20 place-items-center text-lg">
        {hasNextPage ? <LoaderCircle className="size-14 animate-spin rounded-full" /> : "The End?"}
      </div>
    </main>
  );
}
