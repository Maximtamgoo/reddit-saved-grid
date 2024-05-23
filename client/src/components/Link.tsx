import { AnchorHTMLAttributes, PropsWithChildren } from "react";

export default function Link<T extends AnchorHTMLAttributes<HTMLAnchorElement>>({
  children,
  ...props
}: PropsWithChildren<T>) {
  return (
    <a href="#" target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
}
