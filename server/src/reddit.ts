import { literal, number, object, string } from "@badrap/valita";
import createError from "http-errors";
import { env } from "./envConfig.js";

const RedditTokenResponse = object({
  access_token: string(),
  refresh_token: string(),
  expires_in: number(),
  token_type: string(),
  scope: string()
});

const WeirdRedditResponse = literal("0");

const base64Creds = Buffer.from(`${env.REDDIT_CLIENTID}:${env.REDDIT_CLIENT_SECRET}`).toString(
  "base64"
);

const options = {
  method: "POST",
  headers: {
    "User-Agent": env.REDDIT_USERAGENT,
    Authorization: `Basic ${base64Creds}`,
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

export async function authorize(code: string) {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    ...options,
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${env.REDDIT_REDIRECT_URI}`
  });

  if (!res.ok) throw createError(res.status, res.statusText);
  return RedditTokenResponse.parse(await res.json());
}

export async function getNewAccessToken(refreshToken: string) {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    ...options,
    body: `grant_type=refresh_token&refresh_token=${refreshToken}&redirect_uri=${env.REDDIT_REDIRECT_URI}`
  });

  if (!res.ok) throw createError(res.status, res.statusText);
  return RedditTokenResponse.parse(await res.json());
}

export async function revokeToken(tokenHint: "access_token" | "refresh_token", token: string) {
  const res = await fetch("https://www.reddit.com/api/v1/revoke_token", {
    ...options,
    body: `token=${token}&token_type_hint=${tokenHint}&redirect_uri=${env.REDDIT_REDIRECT_URI}`
  });

  if (!res.ok) throw createError(res.status, res.statusText);
  return WeirdRedditResponse.parse(res.headers.get("content-length"));
}

export async function toggleBookmark(access_token: string, state: "unsave" | "save", id: string) {
  const res = await fetch(`https://oauth.reddit.com/api/${state}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access_token}`
    },
    body: `id=${id}`
  });

  if (!res.ok) throw createError(res.status, res.statusText);
  return object({}).parse(await res.json());
}
