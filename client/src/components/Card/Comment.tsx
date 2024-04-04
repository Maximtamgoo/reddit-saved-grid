type Props = {
  permalink: string;
  comment: string;
};

export default function Comment({ permalink, comment }: Props) {
  const postLink = `https://www.reddit.com${permalink}`;

  return (
    <a href={postLink} target="_blank" rel="noreferrer">
      <div
        className=" aspect-square"
        style={{
          minHeight: "300px",
          maxHeight: "calc(100vh - 14rem)"
        }}
      >
        {comment}
      </div>
    </a>
  );
}
