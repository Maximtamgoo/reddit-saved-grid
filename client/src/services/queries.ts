import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import * as api from "./api";
import HttpError from "../utils/HttpError";
import trimRedditListing from "../utils/trimRedditListing";

const urlParams = new URLSearchParams(window.location.search);
window.history.replaceState(null, "", "/");

export function useGetSignedInUser() {
  return useQuery({
    queryKey: ["username"],
    queryFn: async () => {
      const urlError = urlParams.get("error");
      if (urlError) throw urlError;
      const urlCode = urlParams.get("code");
      if (urlCode) await api.authorize(urlCode);
      return await api.getMe();
    },
    select: (data) => data.name,
    retry: (failureCount, error) => {
      if (error instanceof HttpError) return false;
      if (failureCount) return false;
      return true;
    }
  });
}

export function useGetSavedContent(username: string) {
  return useInfiniteQuery({
    queryKey: ["posts", "username", username],
    initialPageParam: "initial",
    queryFn: async ({ pageParam: after }) => {
      // await new Promise((r) => setTimeout(r, 3000)); //! TEMP FAKE DELAY

      const redditListing = await api.getSavedContent(username, after);
      return trimRedditListing(redditListing);
    },
    getNextPageParam: (lastPage) => lastPage.after,
    retry: (failureCount, error) => {
      if (error instanceof HttpError) return false;
      if (failureCount) return false;
      return true;
    }
  });
}
