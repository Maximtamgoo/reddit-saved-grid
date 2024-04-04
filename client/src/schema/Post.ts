type Base = {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  permalink: string;
  saved: boolean;
};

interface Text extends Base {
  type: "text";
  text: string;
}

interface Image extends Base {
  type: "image";
  preview?: string;
  source: string;
  isGif: boolean;
}

interface Gallery extends Base {
  type: "gallery";
  preview?: string;
  gallery: string[];
}

interface Comment extends Omit<Base, "title"> {
  type: "comment";
  comment: string;
}

export interface Unknown extends Base {
  type: "unknown";
}

export type Post = Text | Image | Gallery | Comment | Unknown;
