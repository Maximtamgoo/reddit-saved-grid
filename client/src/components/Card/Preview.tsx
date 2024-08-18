import { ImageData } from "@src/schema/Post";
import LoaderCircle from "@src/svg/loader-circle.svg?react";
import { calculateAspectRatioFit } from "@src/utils/calculateAspectRatioFit";
import { useMemo, useState } from "react";

type Props = {
  width: number;
  imageData: ImageData;
  galleryLength?: number;
  isGif?: boolean;
  onClick: () => void;
};

export default function Preview({
  width,
  imageData,
  galleryLength = 0,
  isGif = false,
  onClick
}: Props) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const height = useMemo(() => {
    return Math.round(
      calculateAspectRatioFit(imageData.width, imageData.height, width, imageData.height).height
    );
  }, [imageData, width]);

  return (
    <div
      onClick={onClick}
      className="relative flex min-h-0 grow cursor-pointer items-center justify-center overflow-hidden rounded-b-lg"
      style={{
        height: `${height}px`
      }}
    >
      {isError ? (
        <div className="text-8xl">P?</div>
      ) : (
        <img
          className="max-h-full bg-red-300 object-contain"
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
