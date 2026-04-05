"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarDays, ChevronDown } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import DropdownPanel from "@/components/ui/dropdown-panel"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
  checkIn: string
  checkOut: string
  onChange: (nextRange: { checkIn: string; checkOut: string }) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerClassName: string
  dropdownClassName: string
  placeholder?: string
  labelClassName?: string
}

const parseIsoDate = (value: string) => {
  if (!value) return undefined
  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const toIsoDate = (value?: Date) => {
  if (!value) return ""
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  open,
  onOpenChange,
  triggerClassName,
  dropdownClassName,
  placeholder = "Nhan phong - Tra phong",
  labelClassName = "truncate text-sm font-semibold",
}: DateRangePickerProps) {
  const today = React.useMemo(() => {
    const next = new Date()
    next.setHours(0, 0, 0, 0)
    return next
  }, [])

  const range = React.useMemo<DateRange | undefined>(() => {
    const from = parseIsoDate(checkIn)
    const to = parseIsoDate(checkOut)

    if (!from && !to) return undefined

    return { from, to }
  }, [checkIn, checkOut])

  const displayLabel =
    range?.from && range?.to
      ? `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`
      : range?.from
        ? format(range.from, "dd/MM/yyyy")
        : placeholder

  const handleSelect = (nextRange: DateRange | undefined) => {
    onChange({
      checkIn: toIsoDate(nextRange?.from),
      checkOut: toIsoDate(nextRange?.to),
    })
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => onOpenChange(!open)} className={triggerClassName}>
        <CalendarDays className="size-4 text-slate-500" />
        <span className={labelClassName}>{displayLabel}</span>
        <ChevronDown className="ml-auto size-4 text-slate-500" />
      </button>

      {open ? (
        <DropdownPanel
          className={cn(
            dropdownClassName,
            "w-fit overflow-hidden rounded-md p-0 shadow-[0_14px_28px_rgba(16,35,52,0.25)] backdrop-blur-md",
          )}
        >
          <Card className="w-fit border-[rgba(255,255,255,0.72)] bg-[rgba(255,255,255,0.6)] p-0 shadow-none">
            <CardContent className="p-0">
              <Calendar
                mode="range"
                defaultMonth={range?.from ?? today}
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={2}
                disabled={(date) => date < today}
                className="rounded-md bg-transparent p-3"
              />
            </CardContent>
          </Card>
        </DropdownPanel>
      ) : null}
    </div>
  )
}

export { DateRangePicker }
