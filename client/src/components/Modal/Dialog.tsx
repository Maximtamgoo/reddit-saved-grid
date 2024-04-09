import { PropsWithChildren, createPortal, useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
};

export default function Dialog({ onClose, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    ref.current?.showModal();
    return () => (document.body.style.overflow = "auto");
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      className="h-screen max-h-full w-screen max-w-full bg-transparent"
    >
      {children}
    </dialog>,
    document.body
  );
}
