import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ModuleContainer({ children, className }: Props) {
  return (
    <div className={cn("px-5 pb-24 pt-2 flex flex-col gap-0", className)}>
      {children}
    </div>
  );
}
