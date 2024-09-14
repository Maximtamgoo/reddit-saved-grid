import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Dialog({ isOpen, onClose, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && ref.current) {
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
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog ref={ref} onClose={onClose} className="size-full max-h-full max-w-full">
      {children}
    </dialog>,
    document.body
  );
}
