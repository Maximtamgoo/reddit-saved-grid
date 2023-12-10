import { useEffect, useState } from "react";
import { useStore, useTokenStore } from "../store";
import { authorize } from "../services/redditTokens";
import { getMe } from "../services/oauthReddit";

const pathname = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);
const redirectParams = {
  code: urlParams.get("code"),
  error: urlParams.get("error")
};

window.history.replaceState({}, document.title, "/");

export default function useCheckSignedInUser() {
  const username = useStore((state) => state.username);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function startAuth() {
      const setUsername = useStore.getState().setUsername;
      const setTokens = useTokenStore.getState().setTokens;
      try {
        if (redirectParams.error === "access_denied") {
          throw redirectParams.error;
        }

        if (pathname === "/auth_callback" && redirectParams.code) {
          const { access_token, refresh_token } = await authorize(redirectParams.code);
          setTokens(access_token, refresh_token);
        }

        const data = await getMe();
        setUsername(data.name);
      } catch (error) {
        setUsername(null);
      } finally {
        setLoading(false);
      }
    }
    startAuth();
  }, []);

  return { username, loading };
}
