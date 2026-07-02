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
        "flex-1 h-10 rounded-xl flex items-center justify-center",
        "transition-all duration-fast active:scale-90",
        completed
          ? "bg-linear-to-br from-emerald-500 to-teal-600 shadow-card"
          : isToday
            ? "bg-transparent border-2 border-emerald-500/50"
            : isFuture
              ? "bg-fill-primary opacity-30 cursor-default"
              : "bg-fill-primary",
      )}
    >
      {completed && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 13 13"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
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
