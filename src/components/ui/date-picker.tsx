"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  /** Date value as YYYY-MM-DD string */
  value?: string
  /** Callback with YYYY-MM-DD string or undefined when cleared */
  onChange: (date: string | undefined) => void
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Additional class names for the trigger button */
  className?: string
  /** Disable the picker */
  disabled?: boolean
}

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse YYYY-MM-DD string to Date object
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const d = parse(value, "yyyy-MM-dd", new Date())
    return isValid(d) ? d : undefined
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(day) => {
            if (day) {
              onChange(format(day, "yyyy-MM-dd"))
            } else {
              onChange(undefined)
            }
            setOpen(false)
          }}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          fromYear={1950}
          toYear={2050}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
