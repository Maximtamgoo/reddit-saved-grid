import FileImage from "@src/svg/file-image.svg?react";
import Play from "@src/svg/play.svg?react";
import { useState } from "react";

type Props = {
  url: string;
  playable: boolean;
  galleryLength: number;
  onClick: () => void;
};

export default function Preview({ url, playable = false, galleryLength = 0, onClick }: Props) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div
      className="relative flex min-h-0 grow cursor-pointer items-center justify-center bg-slate-50"
      onClick={onClick}
    >
      {isError ? (
        <div className="text-8xl">?</div>
      ) : (
        <>
          <img
            className="max-h-full"
            src={url}
            onLoad={() => setLoading(false)}
            onError={() => {
              setIsError(true);
              setLoading(false);
            }}
            alt="Reddit Content"
          />
          {!loading && playable && (
            <button className="absolute grid size-14 place-items-center rounded-full bg-sky-50 shadow-md shadow-slate-800 hover:bg-sky-100">
              <Play className="size-10 fill-sky-500 stroke-sky-500" />
            </button>
          )}
        </>
      )}
      {galleryLength > 1 && (
        <div className="absolute right-4 top-4 grid h-8 min-w-8 place-items-center rounded-lg bg-transparent/80 px-1.5 font-semibold text-white">
          {galleryLength}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-slate-50">
          <div className="grid size-full animate-pulse place-items-center bg-slate-100">
            <FileImage className="size-14 stroke-slate-300" />
          </div>
        </div>
      )}
    </div>
  );
}
