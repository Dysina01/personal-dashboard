import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className }: Props) {
  return (
    <div
      className={cn(
        "h-1.5 w-full rounded-full bg-fill-primary overflow-hidden",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-accent transition-all duration-slow ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
