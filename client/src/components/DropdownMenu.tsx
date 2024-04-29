import { PropsWithChildren, useState } from "react";
import Menu from "@src/svg/menu.svg?react";

export default function DropdownMenu({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative size-fit">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-md p-1 hover:bg-zinc-800"
      >
        <Menu className="size-full" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-12 grid w-32 gap-1 rounded-md bg-zinc-800 p-1">
          {children}
        </div>
      )}
    </div>
  );
}
