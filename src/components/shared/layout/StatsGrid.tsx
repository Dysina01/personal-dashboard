import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function StatsGrid({ children, columns = 2, className }: Props) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 2 ? "grid-cols-2" : "grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
