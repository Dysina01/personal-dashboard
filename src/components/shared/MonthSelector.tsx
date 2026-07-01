"use client";

import { addMonths, formatMonthShort } from "@/lib/utils";
import { useRef } from "react";
import { cn } from "@/lib/utils";

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

  const currentReal = new Date();
  const currentRealMonth = `${currentReal.getFullYear()}-${String(currentReal.getMonth() + 1).padStart(2, "0")}`;

  const isNextDisabled = !allowFuture && next > currentRealMonth;

  function goTo(month: string) {
    if (!allowFuture && month > currentRealMonth) return;
    onChange(month);
  }

  return (
    <div className="flex flex-col items-center pt-2 pb-1 select-none">
      {/* three months */}
      <div className="flex w-full">
        <button
          onClick={() => goTo(prev)}
          className="flex-1 text-center py-1.5 text-callout text-text-muted opacity-50 active:opacity-70 transition-opacity"
        >
          {formatMonthShort(prev)}
        </button>

        <div className="flex-1 text-center py-1.5 text-headline font-semibold text-text-primary">
          {formatMonthShort(selectedMonth)}
        </div>

        <button
          onClick={() => goTo(next)}
          disabled={isNextDisabled}
          className={cn(
            "flex-1 text-center py-1.5 text-callout transition-opacity",
            isNextDisabled
              ? "text-text-disabled opacity-30 pointer-events-none"
              : "text-text-muted opacity-50 active:opacity-70",
          )}
        >
          {formatMonthShort(next)}
        </button>
      </div>

      {/* dots indicator */}
      <div className="flex gap-1 mt-1.5 mb-0.5">
        {[-2, -1, 0, 1, 2].map((offset) => {
          const m = addMonths(selectedMonth, offset);
          const isActive = offset === 0;
          const isFuture = m > currentRealMonth;
          return (
            <button
              key={offset}
              onClick={() => goTo(m)}
              disabled={isFuture && !allowFuture}
              className={cn(
                "h-1 rounded-full transition-all duration-base",
                isActive
                  ? "w-4 bg-text-primary"
                  : "w-1 bg-border-strong opacity-50",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
