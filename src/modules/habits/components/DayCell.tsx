"use client";

import { cn } from "@/lib/utils";

interface Props {
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  onToggle: () => void;
}

export function DayCell({ completed, isToday, isFuture, onToggle }: Props) {
  return (
    <button
      onClick={isFuture ? undefined : onToggle}
      disabled={isFuture}
      className={cn(
        "flex-1 h-9 rounded-sm flex items-center justify-center",
        "transition-all duration-fast active:scale-90",
        "border",
        completed
          ? "bg-accent border-accent"
          : isToday
            ? "bg-transparent border-accent"
            : isFuture
              ? "bg-fill-primary border-transparent opacity-30 cursor-default"
              : "bg-fill-primary border-transparent",
      )}
    >
      {completed && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none"
        >
          <polyline points="1.5,6.5 5,10.5 11.5,2.5" />
        </svg>
      )}
    </button>
  );
}
