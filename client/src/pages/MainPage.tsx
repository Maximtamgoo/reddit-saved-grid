import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useGetSavedContent } from "@src/services/queries";
import VirtualMasonry from "@src/components/VirtualMasonry";
import Card from "@src/components/Card/Card";
import ThreeDots from "@src/svg/three-dots.svg?react";
import { Post } from "@src/schema/Post";
import Dialog from "@src/components/Modal/Dialog";
import Modal from "@src/components/Modal/Modal";

export default function MainPage({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalDataRef = useRef<Post>();

  const { ref, inView } = useInView();

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetched } =
    useGetSavedContent(username);

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

  const onClickPreview = useCallback((post: Post) => {
    modalDataRef.current = post;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  if (isError) {
    console.log("error:", error);
    return <div>{error}</div>;
  }

  if (isLoading) {
    return (
      <main className="absolute inset-0 grid place-items-center bg-zinc-900">
        <ThreeDots className="fill-blue-500" />
      </main>
    );
  }

  return (
    <main className="text-blue-500">
      {isOpen && modalDataRef.current && (
        <Dialog onClose={() => setIsOpen(false)}>
          <Modal post={modalDataRef.current} />
        </Dialog>
      )}
      <VirtualMasonry items={posts}>
        {(item, i) => (
          <Card post={item} pageParam={pageParams[i]} onClickPreview={onClickPreview} />
        )}
      </VirtualMasonry>
      {isFetched && (
        <div ref={ref} className="grid h-20 place-items-center text-lg">
          {hasNextPage ? <ThreeDots className="fill-blue-500" /> : "The End?"}
        </div>
      )}
    </main>
  );
}
