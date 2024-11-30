import { useEffect, useRef, useState } from "react";

type Props = {
  url: string;
  poster: string;
};

export default function Playable({ url, poster }: Props) {
  const [isError, setIsError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function onChange() {
      if (document.hidden && videoRef.current) videoRef.current.pause();
    }
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      {isError ? (
        <div className="text-8xl">?</div>
      ) : (
        <video
          ref={videoRef}
          className="max-h-full"
          src={url}
          poster={poster}
          autoPlay={true}
          loop={true}
          controls={true}
          onClick={(e) => e.stopPropagation()}
          onError={() => {
            setIsError(true);
          }}
        ></video>
      )}
    </div>
  );
}
