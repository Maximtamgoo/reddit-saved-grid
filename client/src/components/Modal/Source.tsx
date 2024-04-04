import { useEffect, useState } from "react";
import Oval from "../../svg/oval.svg?react";

type Props = {
  url?: string;
};

export default function Source({ url }: Props) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function onLoad() {
    // await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  }

  useEffect(() => {
    console.log("mount");
    return () => console.log("un mount");
  });

  if (!url || isError) {
    return <div className="grid aspect-square place-items-center rounded-md text-8xl">?</div>;
  }

  return (
    <>
      {/* <img className="absolute h-full w-full object-cover opacity-40 blur-xl" src={url} /> */}
      <img
        disabled={loading}
        className="relative h-full w-full object-scale-down"
        src={url}
        onLoad={onLoad}
        onError={() => setIsError(true)}
        alt="Reddit Content"
      />
      {loading && (
        <div className="absolute inset-0 grid place-items-center backdrop-blur-xl">
          <Oval className="h-14 w-14" />
        </div>
      )}
    </>
  );
}
