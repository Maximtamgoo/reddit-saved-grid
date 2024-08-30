import { string, object, literal, number, Infer } from "@badrap/valita";

export const T1_COMMENT = object({
  kind: literal("t1"),
  data: object({
    id: string(),
    name: string(),
    author: string(),
    subreddit: string(),
    permalink: string(),
    created: number(),
    created_utc: number(),
    body: string().optional(),
    body_html: string().optional()
  })
});

export type T1_COMMENT = Infer<typeof T1_COMMENT>;
