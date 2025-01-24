import { cn } from "~/app/lib/utils";
import { type ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col px-4 py-10 md:max-w-screen-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
