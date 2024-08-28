import { ListingItem } from "@src/schema/Listing";
import { Post } from "@src/schema/Post";
import { trimListingItem } from "@src/utils/trimListingItem";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

const urlParams = new URLSearchParams(window.location.search);
window.history.replaceState(null, "", "/");

export function useGetSignedInUser() {
  return useQuery({
    queryKey: ["userData"],
    retry: false,
    staleTime: Infinity,
    queryFn: async () => {
      const urlError = urlParams.get("error");
      if (urlError) throw urlError;
      const urlCode = urlParams.get("code");
      if (urlCode) await api.authorize(urlCode);
      return await api.getMe();
    }
  });
}

export function useGetSavedContent() {
  const username = useGetSignedInUser().data?.name;
  return useInfiniteQuery({
    queryKey: ["posts", username],
    enabled: !!username,
    retry: false,
    // staleTime: Infinity, //TODO could this replace isBusyRef?
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      const listing = await api.getSavedContent(username ?? "", pageParam);
      const posts: Post[] = [];
      for (const item of listing.data.children) {
        const listingItemResult = ListingItem.try(item, { mode: "strip" });
        if (!listingItemResult.ok) {
          console.log("Failed to parse ListingItem:", listingItemResult.message);
          console.log("Failed ListingItem:", item);
          continue;
        }

        const postResult = Post.try(trimListingItem(listingItemResult.value, pageParam));
        if (!postResult.ok) {
          console.log("Failed to parse Post:", postResult.message);
          console.log("Failed Post:", listingItemResult.value);
          continue;
        }
        if (postResult.value.type === "unknown") console.log("item:", item);
        posts.push(postResult.value);
      }

      return {
        after: listing.data.after,
        before: listing.data.before,
        posts
      };
    },
    getNextPageParam: (lastPage) => lastPage.after
  });
}

export function useGetSubRedditIcon(subreddit: string) {
  return useQuery({
    queryKey: ["subreddit", subreddit, "icon"],
    retry: false,
    staleTime: Infinity,
    queryFn: () => api.getSubRedditIcon(subreddit),
    select: (data) => {
      const community_icon = data.data.community_icon;
      if (community_icon !== "") return community_icon.split("amp;").join("");
      return data.data.icon_img.split("amp;").join("");
    }
  });
}

export function useToggleBookmark(id: string, pageParam: string) {
  const qc = useQueryClient();
  const username = useGetSignedInUser().data?.name;
  return useMutation({
    mutationKey: ["toggleBookmark", id],
    retry: false,
    mutationFn: ({ saved }: { saved: boolean }) => api.toggleBookmark(id, saved),
    onSuccess: (_, { saved }) => {
      type QueryData = ReturnType<typeof useGetSavedContent>["data"];
      qc.setQueryData<QueryData>(["posts", username], (oldData) => {
        if (oldData) {
          let found = false;
          const newPages = [];
          for (const i in oldData.pages) {
            const page = oldData.pages[i];
            if (!found) {
              if (oldData.pageParams[i] === pageParam) {
                const postIndex = page.posts.findIndex((post) => post.id === id);
                if (postIndex !== -1) {
                  page.posts[postIndex].saved = saved;
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
