import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  text: string;
};

export default function Text({ text }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) setLines(Math.floor(ref.current.clientHeight / 24));
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-hidden whitespace-break-spaces break-words px-4"
      style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines
      }}
    >
      {text}
    </div>
  );
}
