import { ReactElement } from "react";

export default function Container({
  children,
}: {
  children: ReactElement[] | ReactElement;
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-5">{children}</div>
  );
}
