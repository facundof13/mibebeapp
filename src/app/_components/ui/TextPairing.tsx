import { cn } from "~/lib/utils";
import { type ReactNode } from "react";

export default function TextPairing({
  label,
  sublabel = "",
  labelClassName = "",
  sublabelClassName = "",
}: {
  label: ReactNode;
  sublabel?: ReactNode;
  labelClassName?: string;
  sublabelClassName?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className={cn("text-lg font-medium", labelClassName)}>{label}</div>
      <div className={cn("text-sm font-light opacity-90", sublabelClassName)}>
        {sublabel}
      </div>
    </div>
  );
}
