import { number, object, string } from "@badrap/valita";
import { ListingItem } from "@src/schema/Listing";
import { RedditItem } from "@src/schema/RedditItem";
import { getLocalStorage } from "@src/utils/getLocalStorage";
import { transformRedditItem } from "@src/utils/transformRedditItem";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBrowserLocation } from "wouter/use-browser-location";
import * as api from "./api";

export function useGetSignedInUser() {
  const navigate = useBrowserLocation()[1];
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (location.pathname === "/auth_callback") navigate("/", { replace: true });
      const urlError = urlParams.get("error");
      if (urlError) throw urlError;
      const urlCode = urlParams.get("code");
      if (urlCode) await api.authorize(urlCode);
      return await api.getMe();
    }
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["signOut"],
    mutationFn: api.signOut,
    onSuccess: () => qc.resetQueries({ queryKey: ["userData"], exact: true })
  });
}

export function useGetSavedContent() {
  const username = useGetSignedInUser().data?.name;
  return useInfiniteQuery({
    queryKey: ["redditItems", username],
    enabled: !!username,
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      const listing = await api.getSavedContent(username ?? "", pageParam);
      console.log("listing:", listing);
      const redditItems: RedditItem[] = [];
      for (const item of listing.data.children) {
        const listingItemResult = ListingItem.try(item, { mode: "strip" });
        if (!listingItemResult.ok) {
          console.log("Failed to parse ListingItem:", listingItemResult.message);
          console.log("Failed ListingItem:", item);
          continue;
        }

        const result = RedditItem.try(transformRedditItem(listingItemResult.value, pageParam));
        if (!result.ok) {
          console.log("Failed to parse reddit item:", result.message);
          console.log("Failed reddit item:", listingItemResult.value);
          continue;
        }
        if (result.value.type === "unknown") console.log("unknown item:", item);
        redditItems.push(result.value);
      }

      return {
        after: listing.data.after,
        before: listing.data.before,
        redditItems
      };
    },
    getNextPageParam: (lastPage) => lastPage.after
  });
}

export function useGetSubRedditIcon(subreddit: string) {
  return useQuery({
    queryKey: ["subreddit", "icon", subreddit],
    refetchOnMount: false,
    queryFn: async ({ queryKey, signal }) => {
      const key = queryKey.join("_");
      const schema = object({ expires: number(), url: string() });
      const icon = getLocalStorage(key, schema);
      if (icon && icon.expires > Date.now()) return icon.url;
      localStorage.removeItem(key);
      const data = await api.getSubRedditIcon(subreddit, signal);
      let url = "";
      if (data.community_icon !== "") url = data.community_icon;
      if (data.icon_img !== "") url = data.icon_img;
      localStorage.setItem(
        key,
        JSON.stringify({
          expires: Date.now() + 60 * 60 * 1000 * 24, // 24 hours
          url
        })
      );
      return url;
    }
  });
}

export function useToggleBookmark(id: string, pageParam: string) {
  const qc = useQueryClient();
  const username = useGetSignedInUser().data?.name;
  return useMutation({
    mutationKey: ["toggleBookmark", id],
    mutationFn: ({ saved }: { saved: boolean }) => api.toggleBookmark(id, saved),
    onSuccess: (_, { saved }) => {
      type QueryData = ReturnType<typeof useGetSavedContent>["data"];
      qc.setQueryData<QueryData>(["redditItems", username], (oldData) => {
        if (oldData) {
          let found = false;
          const newPages = [];
          for (const i in oldData.pages) {
            const page = oldData.pages[i];
            if (!found) {
              if (oldData.pageParams[i] === pageParam) {
                const postIndex = page.redditItems.findIndex((post) => post.id === id);
                if (postIndex !== -1) {
                  page.redditItems[postIndex].saved = saved;
                  found = true;
                }
              }
            }
            newPages.push(page);
          }

          return {
            pages: newPages,
            pageParams: oldData.pageParams
          };
        }
      });
    }
  });
}
