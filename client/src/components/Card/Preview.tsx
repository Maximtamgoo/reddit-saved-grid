import { ImageData } from "@src/schema/Post";
import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { useState } from "react";

type Props = {
  imageData: ImageData;
  galleryLength?: number;
  isGif?: boolean;
  onClick: () => void;
};

export default function Preview({ imageData, galleryLength = 0, isGif = false, onClick }: Props) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative flex min-h-0 grow cursor-pointer items-center justify-center overflow-hidden rounded-b-lg"
    >
      {isError ? (
        <div className="text-8xl">?</div>
      ) : (
        <img
          className="max-h-full"
          src={imageData.url}
          onLoad={() => setLoading(false)}
          onError={() => {
            setIsError(true);
            setLoading(false);
          }}
          alt="Reddit Content"
        />
      )}
      {(galleryLength > 0 || isGif) && (
        <div className="ring-3 absolute right-2 top-2 grid h-7 min-w-7 place-items-center rounded-md bg-slate-100 px-2 font-semibold ring-2 ring-slate-300">
          {galleryLength || "GIF"}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 grid place-items-center backdrop-blur-xl">
          <LoaderCircle className="size-14 animate-spin rounded-full stroke-slate-100" />
        </div>
      )}
    </div>
  );
}
