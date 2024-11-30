import { useState } from "react";

type Props = {
  url: string;
};

export default function Image({ url }: Props) {
  const [isError, setIsError] = useState(false);

  return (
    <div className="flex h-full items-center justify-center">
      {isError ? (
        <div className="text-8xl">?</div>
      ) : (
        <img
          className="max-h-full"
          src={url}
          onClick={(e) => e.stopPropagation()}
          onError={() => setIsError(true)}
          alt="Reddit Content"
        />
      )}
    </div>
  );
}
