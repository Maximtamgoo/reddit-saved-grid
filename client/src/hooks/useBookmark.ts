import { useState } from "react";
import { useStore } from "../store";
import { toggleBookmark } from "../services/oauthReddit";

export default function useBookmark(id: string, savedState: boolean) {
  const [saved, setSaved] = useState(savedState);
  const [loading, setLoading] = useState(false);

  async function toggle(e: MouseEvent) {
    e.stopPropagation();
    if (!loading) {
      try {
        setLoading(true);
        await toggleBookmark(id, saved ? "unsave" : "save");
        setSaved(!saved);
        useStore.getState().setBookmarkState(id, !saved);
      } catch (error) {
        // console.log('error:', error)
      } finally {
        setLoading(false);
      }
    }
  }

  return { saved, toggle };
}
