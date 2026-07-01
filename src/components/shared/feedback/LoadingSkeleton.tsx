import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function LoadingSkeleton({ className }: Props) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-fill-primary", className)}
    />
  );
}
