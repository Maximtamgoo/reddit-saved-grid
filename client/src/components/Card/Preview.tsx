import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { useState } from "react";

type Props = {
  url: string;
  galleryLength?: number;
  isGif?: boolean;
  onClick: () => void;
};

export default function Preview({ url, galleryLength = 0, isGif = false, onClick }: Props) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="relative flex min-h-0 grow cursor-pointer items-center justify-center overflow-hidden rounded-lg p-2 ring-slate-300 ring-offset-2 focus:outline-none focus:ring-2"
    >
      <img
        className="absolute size-full object-cover opacity-50 blur-lg"
        src={url}
        onLoad={() => setLoading(false)}
        onError={() => {
          setIsError(true);
          setLoading(false);
        }}
        alt="Reddit Content"
      />
      {isError ? (
        <div className="text-8xl">?</div>
      ) : (
        <img
          className="relative max-h-full"
          src={url}
          onLoad={() => setLoading(false)}
          onError={() => {
            setIsError(true);
            setLoading(false);
          }}
          alt="Reddit Content"
        />
      )}
      {(galleryLength > 1 || isGif) && (
        <div className="ring-3 absolute right-4 top-2 grid h-7 min-w-8 place-items-center rounded-lg bg-slate-100 px-1.5 font-semibold shadow-inner shadow-slate-300 ring-1 ring-slate-200">
          {galleryLength || "GIF"}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 grid place-items-center backdrop-blur-xl">
          <LoaderCircle className="size-14 animate-spin rounded-full" />
        </div>
      )}
    </button>
  );
}
