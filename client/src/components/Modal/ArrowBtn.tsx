import ChevronLeft from "@src/svg/chevron-left.svg?react";

type Props = {
  direction: "left" | "right";
  onClick: () => void;
};

export default function ArrowBtn({ direction, onClick }: Props) {
  return (
    <button
      className="absolute top-2/4 grid size-10 -translate-y-2/4 place-items-center rounded-full bg-transparent/90 text-white data-[arrow=left]:left-5 data-[arrow=right]:right-5"
      data-arrow={direction}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {direction === "left" ? <ChevronLeft /> : <ChevronLeft className="rotate-180" />}
    </button>
  );
}
