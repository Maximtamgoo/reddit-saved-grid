import { object, string } from "@badrap/valita";
import { Listing } from "@src/schema/Listing";
import HttpError from "@src/utils/HttpError";

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function authorize(authorization_code: string) {
  const res = await fetch("/api/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorization_code })
  });
  if (!res.ok) throw new HttpError(res.status, res.statusText);
}

export async function getNewAccessToken() {
  const res = await fetch("/api/access_token", {
    method: "POST"
  });
  if (!res.ok) throw new HttpError(res.status, res.statusText);
}

export async function getMe() {
  const token = getCookie("access_token");
  if (!token) await getNewAccessToken();
  const res = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${getCookie("access_token")}`
    }
  });
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return object({
    name: string()
  }).parse(await res.json(), { mode: "strip" });
}

export async function getSavedContent(username: string, after: string | null, limit = 50) {
  const token = getCookie("access_token");
  if (!token) await getNewAccessToken();
  const res = await fetch(
    `https://oauth.reddit.com/user/${username}/saved?after=${after}&limit=${limit}&raw_json=1`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`
      }
    }
  );
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return Listing.parse(await res.json(), { mode: "strip" });
}

export async function toggleBookmark(id: string, state: boolean) {
  const token = getCookie("access_token");
  if (!token) await getNewAccessToken();
  const res = await fetch(`/api/bookmark/${state ? "save" : "unsave"}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access_token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return (await res.json()) as { saved: boolean };
}

export async function signOut() {
  const res = await fetch("/api/signout", { method: "POST" });
  if (!res.ok) throw new HttpError(res.status, res.statusText);
}
