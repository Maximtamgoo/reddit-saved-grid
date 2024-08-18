type Base = {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  permalink: string;
  saved: boolean;
  pageParam: string;
};

export type ImageData = {
  url: string;
  width: number;
  height: number;
};

interface Image extends Base {
  type: "image";
  preview: ImageData;
  source: ImageData;
  isGif: boolean;
}

interface Gallery extends Base {
  type: "gallery";
  preview: ImageData;
  gallery: ImageData[];
}

interface Text extends Base {
  type: "text";
  text: string;
}

interface Comment extends Omit<Base, "title"> {
  type: "comment";
  comment: string;
}

// export interface Unknown extends Base {
//   type: "unknown";
// }

export type Post = Text | Image | Gallery | Comment;
