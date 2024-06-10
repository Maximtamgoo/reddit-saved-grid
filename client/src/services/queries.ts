import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import { Post } from "@src/schema/Post";
import { trimListingItem } from "@src/utils/trimListingItem";
import { ListingItem } from "@src/schema/Listing";

const urlParams = new URLSearchParams(window.location.search);
window.history.replaceState(null, "", "/");

export function useGetSignedInUser() {
  return useQuery({
    queryKey: ["userData"],
    retry: false,
    queryFn: async () => {
      const urlError = urlParams.get("error");
      if (urlError) throw urlError;
      const urlCode = urlParams.get("code");
      if (urlCode) await api.authorize(urlCode);
      return await api.getMe();
    }
  });
}

export function useUser() {
  const qc = useQueryClient();
  type UserData = ReturnType<typeof useGetSignedInUser>["data"];
  return qc.getQueryData<UserData>(["userData"]);
}

export function useGetSavedContent() {
  const username = useUser()?.name;
  return useInfiniteQuery({
    queryKey: ["posts", username],
    enabled: !!username,
    retry: false,
    initialPageParam: "",
    queryFn: async ({ pageParam: after }) => {
      const listing = await api.getSavedContent(username!, after);
      const posts: Post[] = [];
      for (const item of listing.data.children) {
        const result = ListingItem.try(item, { mode: "strip" });
        if (result.ok) {
          posts.push(trimListingItem(result.value));
        } else {
          console.error(result.message);
        }
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

export function useToggleBookmark(id: string, pageParam: string) {
  const qc = useQueryClient();
  const username = useUser()?.name;
  return useMutation({
    mutationKey: ["toggleBookmark", id],
    retry: false,
    mutationFn: ({ saved }: { saved: boolean }) => api.toggleBookmark(id, saved),
    onSuccess: (_, { saved }) => {
      type QueryData = ReturnType<typeof useGetSavedContent>["data"];
      qc.setQueryData<QueryData>(["posts", username], (oldData) => {
        if (oldData) {
          const newPages = oldData.pages.map((page, i) => {
            if (oldData.pageParams[i] === pageParam) {
              const postIndex = page.posts.findIndex((post) => post.id === id);
              if (postIndex !== -1) {
                page.posts[postIndex].saved = saved;
                return page;
              }
            }
            return page;
          });

          return {
            pages: newPages,
            pageParams: oldData.pageParams
          };
        }
      });
    }
  });
}
