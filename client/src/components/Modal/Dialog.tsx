import ArrowLeft from "@src/svg/arrow-left.svg?react";
import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function Dialog({ onClose, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current) {
      const paddingRight = document.body.style.paddingRight;
      const overflowY = document.body.style.overflowY;
      const scrollbarWidth = window.innerWidth - document.body.clientWidth + "px";
      document.body.style.paddingRight = scrollbarWidth;
      document.body.style.overflowY = "hidden";
      ref.current.showModal();
      ref.current.focus();
      return () => {
        document.body.style.paddingRight = paddingRight;
        document.body.style.overflowY = overflowY;
      };
    }
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      onClick={onClose}
      onClose={onClose}
      className="size-full max-h-full max-w-full bg-transparent"
    >
      {children}
      <button
        className="absolute left-5 top-5 grid size-10 place-items-center rounded-full bg-transparent/80 text-white"
        onClick={onClose}
      >
        <ArrowLeft />
      </button>
    </dialog>,
    document.body
  );
}
