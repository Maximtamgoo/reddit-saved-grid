import { string, object, union, literal } from "@badrap/valita";

const Schema = object({
  NODE_ENV: union(literal("development"), literal("production")),
  PORT: string(),
  REDDIT_CLIENTID: string(),
  REDDIT_CLIENT_SECRET: string(),
  REDDIT_USERAGENT: string(),
  REDDIT_REDIRECT_URI: string()
});

const result = Schema.try(process.env, { mode: "strip" });

if (!result.ok) {
  console.log(result.message);
  process.exit(1);
}

export const env = result.value;
