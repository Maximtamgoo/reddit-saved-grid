import style from "./MainPage.module.css";
import { useState } from "react";
import { useStore } from "../../store";
import useWindowWidth from "../../hooks/useWindowWidth";
import useInfiniteScroll from "react-infinite-scroll-hook";
import Navbar from "../../components/Navbar/Navbar";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import Loader from "../../svg/three-dots.svg?react";
import { getSavedContent } from "../../services/oauthReddit";
import { XMasonry, XBlock } from "react-xmasonry";
import { RedditListing } from "../../schema/RedditListing";
import { MasonryPost } from "../../schema/MasonryPost";
import { toMasonryPost } from "../../utils/toMasonryPost";
import { z } from "zod";

export default function MainPage() {
  // console.log('MainPage')
  const width = useWindowWidth();
  const list = useStore((state) => state.list);
  const [opened, setOpened] = useState(false);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function fetchMore() {
    console.log("fetchMore");
    try {
      const username = useStore.getState().username;
      if (username) {
        setLoading(true);
        const data = await getSavedContent(username, after);
        // console.log("data:", data);
        const listing = RedditListing.parse(data);
        // console.log("redditListing:", listing);
        const masonryPosts = listing.data.children.map((item) =>
          MasonryPost.parse(toMasonryPost(item))
        );
        // const masonryPosts = convertToMasonryPosts(listing.data.children);
        // console.log("masonryPosts:", masonryPosts);
        if (!listing.data.after) {
          setHasMore(false);
        }
        setAfter(listing.data.after);
        useStore.getState().appendList(masonryPosts);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("error:", error);
        setLoading(true);
        setAfter(null);
      }
    }
  }

  const [targetRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: fetchMore,
    rootMargin: "0px 0px 100px 0px"
  });

  function onOpen(masonryPost: MasonryPost) {
    useStore.getState().setModalData(masonryPost);
    setOpened(true);
  }

  return (
    <>
      {opened && <Modal onClose={() => setOpened(false)} />}
      <Navbar />
      <div className={style.max_width}>
        <XMasonry targetBlockWidth={width <= 500 ? Math.floor(width / 2) : 300}>
          {list.map((masonryPost) => (
            <XBlock key={masonryPost.id}>
              <Card data={masonryPost} onOpen={() => onOpen(masonryPost)} />
            </XBlock>
          ))}
        </XMasonry>
        {(loading || hasMore) && (
          <div ref={targetRef} className={style.loader}>
            <Loader />
          </div>
        )}
        {!hasMore && (
          <>
            <div className={style.theend}>The End?</div>
            <div className={style.limit_msg}>(Reddit has a 1000 saved post limit)</div>
          </>
        )}
      </div>
    </>
  );
}
