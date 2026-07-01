import { cn } from "@/lib/utils";

interface Props {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ label, children, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-2 mt-6", className)}>
      {label && (
        <span className="text-caption font-medium text-text-muted uppercase tracking-wider px-1">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
