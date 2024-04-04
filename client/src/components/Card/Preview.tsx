import { PropsWithChildren, useState } from "react";
import Oval from "../../svg/oval.svg?react";

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

  if (!url || isError) {
    return <div className="grid aspect-square place-items-center rounded-md text-8xl">?</div>;
  }

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-md bg-zinc-700"
      onClick={onClick}
    >
      <img className="absolute h-full w-full object-cover opacity-40 blur-xl" src={url} />
      <img
        className="relative m-auto object-contain"
        src={url}
        onLoad={onLoad}
        onError={() => setIsError(true)}
        alt="Reddit Content"
        style={{
          minHeight: "300px",
          maxHeight: "calc(100vh - 14rem)"
        }}
      />
      {loading && (
        <div className="absolute inset-0 grid place-items-center backdrop-blur-xl">
          <Oval className="h-14 w-14" />
        </div>
      )}
      {children}
    </div>
  );
}
