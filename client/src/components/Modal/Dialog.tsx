import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function Dialog({ onClose, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth + "px";
      document.body.style.paddingRight = scrollbarWidth;
      document.body.style.overflow = "hidden";
      ref.current.showModal();
      ref.current.focus();
      ref.current.blur();
    }
    return () => {
      document.body.style.paddingRight = "0";
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      onClick={onClose}
      onClose={onClose}
      className="size-full max-h-full max-w-full"
    >
      {children}
    </dialog>,
    document.body
  );
}
