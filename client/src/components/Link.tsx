import { ComponentProps, PropsWithChildren } from "react";

export default function Link({ children, ...props }: PropsWithChildren & ComponentProps<"a">) {
  return (
    <a href="#" target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
}
