"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, formatMonth, cn } from "@/lib/utils";

interface Props {
  selectedMonth: string;
  onChange: (month: string) => void;
  allowFuture?: boolean;
}

export function MonthSelector({
  selectedMonth,
  onChange,
  allowFuture = false,
}: Props) {
  const prev = addMonths(selectedMonth, -1);
  const next = addMonths(selectedMonth, +1);

  const now = new Date();
  const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const isNextDisabled = !allowFuture && next > currentRealMonth;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(prev)}
        aria-label="Previous month"
        className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary active:scale-90 active:bg-fill-primary transition-transform duration-instant"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="min-w-36 rounded-chip bg-fill-primary px-4 py-1.5 text-center">
        <span className="text-callout font-semibold text-text-primary">
          {formatMonth(selectedMonth)}
        </span>
      </div>

      <button
        onClick={() => !isNextDisabled && onChange(next)}
        disabled={isNextDisabled}
        aria-label="Next month"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-instant",
          isNextDisabled
            ? "text-text-disabled opacity-30"
            : "text-text-tertiary active:scale-90 active:bg-fill-primary",
        )}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
