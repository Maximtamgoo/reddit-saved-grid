import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MasonryPost } from "../schema/MasonryPost";
import { signOut } from "../services/redditTokens";

interface TokenState {
  access_token: string | null;
  refresh_token: string | null;
  setTokens: (access_token: string | null, refresh_token: string | null) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      setTokens: (access_token, refresh_token) => set(() => ({ access_token, refresh_token }))
    }),
    { name: "tokens" }
  )
);

interface State {
  username: string | null;
  list: MasonryPost[];
  modalData: MasonryPost | Record<string, never>;
  setUsername: (name: string | null) => void;
  appendList: (nextList: MasonryPost[]) => void;
  setModalData: (masonryPost: MasonryPost | Record<string, never>) => void;
  setBookmarkState: (id: string, saved: boolean) => void;
  signOut: () => void;
}

export const useStore = create<State>()((set) => ({
  username: null,
  list: [],
  modalData: {},
  setUsername: (username) => set(() => ({ username })),
  appendList: (nextlist) => set((state) => ({ list: [...state.list, ...nextlist] })),
  setModalData: (modalData) => set(() => ({ modalData })),
  setBookmarkState: (id, saved) =>
    set((state) => ({
      list: state.list.map((masonryPost) =>
        masonryPost.id === id ? { ...masonryPost, saved } : masonryPost
      )
    })),
  signOut: async () => {
    await signOut(useTokenStore.getState().refresh_token);
    useTokenStore.getState().setTokens(null, null);
    set(() => ({ username: null }));
  }
}));
