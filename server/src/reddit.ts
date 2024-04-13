import fetch from "node-fetch";
import createError from "http-errors";
import { env } from "./envConfig.js";
import { object, string, number, literal } from "@badrap/valita";

const RedditTokenResponse = object({
  access_token: string(),
  refresh_token: string(),
  expires_in: number()
});

const WeirdRedditResponse = literal("0");

const base64Creds = Buffer.from(`${env.REDDIT_CLIENTID}:${env.REDDIT_CLIENT_SECRET}`).toString(
  "base64"
);

export async function authorize(code: string) {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "User-Agent": env.REDDIT_USERAGENT,
      Authorization: `Basic ${base64Creds}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${env.REDDIT_REDIRECT_URI}`
  });

  if (res.ok) {
    return RedditTokenResponse.parse(await res.json());
  } else {
    throw createError(res.status, res.statusText);
  }
}

export async function getNewAccessToken(refreshToken: string) {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "User-Agent": env.REDDIT_USERAGENT,
      Authorization: `Basic ${base64Creds}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}&redirect_uri=${env.REDDIT_REDIRECT_URI}`
  });

  if (res.ok) {
    return RedditTokenResponse.parse(await res.json());
  } else {
    throw createError(res.status, res.statusText);
  }
}

export async function revokeToken(tokenHint: "access_token" | "refresh_token", token: string) {
  const res = await fetch("https://www.reddit.com/api/v1/revoke_token", {
    method: "POST",
    headers: {
      "User-Agent": env.REDDIT_USERAGENT,
      Authorization: `Basic ${base64Creds}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `token=${token}&token_type_hint=${tokenHint}&redirect_uri=${env.REDDIT_REDIRECT_URI}`
  });

  if (res.ok) {
    return WeirdRedditResponse.parse(res.headers.get("content-length"));
  } else {
    throw createError(res.status, res.statusText);
  }
}

export async function toggleBookmark(access_token: string, state: "unsave" | "save", id: string) {
  const res = await fetch(`https://oauth.reddit.com/api/${state}`, {
    method: "POST",
    headers: {
      "User-Agent": env.REDDIT_USERAGENT,
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `id=${id}`
  });

  if (res.ok) {
    return object({}).parse(await res.json());
  } else {
    throw createError(res.status, res.statusText);
  }
}
