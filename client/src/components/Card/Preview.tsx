import { PropsWithChildren, useState } from "react";
import { CARD_MAX_HEIGHT, CARD_MIN_HEIGHT } from "@src/constant";
import LoaderCircle from "@src/svg/loader-circle.svg?react";

type Props = {
  url?: string;
  onClick: () => void;
};

export default function Preview({ url, onClick, children }: PropsWithChildren<Props>) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function onLoad() {
    // await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  }

  if (isError) {
    return <div className="grid aspect-square place-items-center text-8xl">?</div>;
  }

  return (
    <div className="relative cursor-pointer overflow-hidden rounded-b-lg" onClick={onClick}>
      <img className="absolute size-full object-cover opacity-40 blur-xl" src={url} />
      <img
        className="relative m-auto object-contain"
        loading="lazy"
        src={url}
        onLoad={onLoad}
        onError={() => setIsError(true)}
        alt="Reddit Content"
        style={{
          minHeight: CARD_MIN_HEIGHT,
          maxHeight: CARD_MAX_HEIGHT
        }}
      />
      {loading && (
        <div className="absolute inset-0 grid place-items-center backdrop-blur-xl">
          <LoaderCircle className="size-14 animate-spin rounded-full" />
        </div>
      )}
      {children}
    </div>
  );
}
