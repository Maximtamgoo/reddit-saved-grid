import {
  array,
  boolean,
  Infer,
  literal,
  number,
  object,
  record,
  string,
  union
} from "@badrap/valita";

export const Entry = object({ url: string(), width: number(), height: number() });
export type Entry = Infer<typeof Entry>;

const GalleryEntry = object({
  x: number(),
  y: number(),
  u: string().optional(),
  mp4: string().optional()
});

const preview = object({
  images: array(
    object({
      id: string(),
      resolutions: array(Entry),
      source: Entry,
      variants: object({
        gif: object({
          resolutions: array(Entry),
          source: Entry
        }).optional(),
        mp4: object({
          resolutions: array(Entry),
          source: Entry
        }).optional()
      })
    })
  )
    .assert((arr) => arr.length === 1)
    .optional(),
  reddit_video_preview: object({
    fallback_url: string(),
    duration: number(),
    hls_url: string(),
    is_gif: boolean(),
    height: number(),
    width: number()
  }).optional()
});

const gallery_data = object({
  items: array(
    object({
      caption: string().optional(),
      media_id: string()
    })
  )
});

const media_metadata = record(
  union(
    object({
      status: literal("valid"),
      id: string(),
      p: array(GalleryEntry).optional(),
      s: GalleryEntry.optional()
    }),
    object({
      status: literal("failed")
    })
  )
);

const secure_media = object({
  type: string().optional(),
  oembed: object({
    html: string()
  }).optional(),
  reddit_video: object({
    fallback_url: string(),
    has_audio: boolean().optional(),
    scrubber_media_url: string(),
    dash_url: string(),
    duration: number(),
    hls_url: string(),
    is_gif: boolean()
  }).optional()
});

const secure_media_embed = object({
  content: string().optional(),
  media_domain_url: string().optional()
});

const t3_link_data = object({
  id: string(),
  name: string(),
  author: string(),
  subreddit: string(),
  subreddit_name_prefixed: string(),
  permalink: string(),
  created: number(),
  created_utc: number(),
  title: string().default(""),
  url: string().optional(),
  post_hint: union(
    literal("self"),
    literal("image"),
    literal("link"),
    literal("rich:video"),
    literal("hosted:video")
  ).optional(),
  is_video: boolean().optional(),
  is_self: boolean().optional(),
  is_gallery: boolean().optional(),
  is_reddit_media_domain: boolean().optional(),
  is_meta: boolean().optional(),
  selftext: string().optional(),
  selftext_html: string().nullable().optional(),
  domain: string().optional(),
  url_overridden_by_dest: string().optional(),
  preview: preview.optional(),
  gallery_data: gallery_data.nullable().optional(),
  media_metadata: media_metadata.nullable().optional(),
  secure_media: secure_media.nullable().optional(),
  secure_media_embed: secure_media_embed.optional()
});

export const T3_LINK = object({
  kind: literal("t3"),
  data: t3_link_data
});

export type T3_LINK = Infer<typeof T3_LINK>;
