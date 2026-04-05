"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  modifiers,
  modifiersClassNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn("p-0", className)}
      classNames={{
        root: "w-full",
        months: "flex flex-col gap-4 md:flex-row md:gap-6",
        month: "w-full min-w-[260px] space-y-2.5",
        month_caption: "relative mb-3 flex h-8 items-center justify-center px-10",
        caption_label: "relative z-0 text-sm font-semibold text-slate-800",
        nav: "absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-2",
        button_previous:
          "inline-flex h-8 w-8 shrink-0 items-center justify-center p-0 text-[#5a9aac] transition hover:text-[#417f94]",
        button_next:
          "inline-flex h-8 w-8 shrink-0 items-center justify-center p-0 text-[#5a9aac] transition hover:text-[#417f94]",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full [&>*:last-child]:font-semibold [&>*:last-child]:text-[#dc2626]",
        weekday:
          "flex h-8 flex-1 items-center justify-center text-center text-xs font-semibold text-[#5d7f90]",
        week: "mt-1 flex w-full",
        day: "relative h-9 flex-1 p-0 text-sm",
        day_button:
          "flex h-9 w-full items-center justify-center rounded-md p-0 text-sm font-medium text-slate-700 transition hover:bg-[rgba(255,255,255,0.45)]",
        selected: "[&>button]:bg-[rgba(255,255,255,0.92)] [&>button]:text-[#0b84ff] [&>button]:font-bold [&>button]:shadow-[inset_0_0_0_1px_rgba(11,132,255,0.18)]",
        range_start:
          "rounded-l-md bg-[rgba(223,240,255,0.82)] [&>button]:bg-[rgba(255,255,255,0.92)] [&>button]:font-bold [&>button]:text-[#0b84ff] [&>button]:shadow-[inset_0_0_0_1px_rgba(11,132,255,0.18)]",
        range_middle:
          "bg-[rgba(223,240,255,0.82)] [&:first-child]:rounded-l-full [&:last-child]:rounded-r-full [&>button]:rounded-full [&>button]:!border-0 [&>button]:!bg-transparent [&>button]:!shadow-none [&>button]:font-semibold [&>button]:text-[#183b67] [&>button]:hover:!bg-transparent",
        range_end:
          "rounded-r-md bg-[rgba(223,240,255,0.82)] [&>button]:bg-[rgba(255,255,255,0.92)] [&>button]:font-bold [&>button]:text-[#0b84ff] [&>button]:shadow-[inset_0_0_0_1px_rgba(11,132,255,0.18)]",
        today: "[&>button]:border [&>button]:border-[rgba(255,255,255,0.72)] [&>button]:text-slate-800",
        outside: "text-slate-300 opacity-60 [&>button]:text-slate-300",
        disabled:
          "text-slate-300 opacity-50 [&>button]:cursor-not-allowed [&>button]:text-slate-300",
        hidden: "invisible",
        chevron: "pointer-events-none size-5 fill-current",
        ...classNames,
      }}
      modifiers={{
        sunday: { dayOfWeek: [0] },
        ...modifiers,
      }}
      modifiersClassNames={{
        sunday: "[&>button]:font-semibold [&>button]:text-[#dc2626]",
        ...modifiersClassNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", iconClassName)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("size-4", iconClassName)} {...iconProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
