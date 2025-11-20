import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "./Calendar"
import { cn } from "../../lib/utils"

export function CalendarTimePicker({ 
  value, 
  onChange, 
  label, 
  required = false, 
  error,
  placeholder = "Selecione a data"
}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(value ? new Date(value) : undefined)

  React.useEffect(() => {
    if (value) {
      // Parse Brazilian date format DD/MM/YYYY
      if (value.includes('/')) {
        const [day, month, year] = value.split('/')
        const dateObj = new Date(year, month - 1, day)
        setDate(dateObj)
      }
    }
  }, [value])

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate)
      setOpen(false)
      
      // Formatar data no formato brasileiro: DD/MM/YYYY
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const year = selectedDate.getFullYear()
      const formattedDate = `${day}/${month}/${year}`
      
      onChange(formattedDate)
    }
  }

  const handleClear = () => {
    setDate(undefined)
    onChange("")
  }

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 border rounded-lg text-left text-sm transition-colors bg-white dark:bg-gray-800",
            date ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500",
            "hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2"
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span>{date ? formatDate(date) : placeholder}</span>
          </div>
        </button>

        {/* Clear button - outside the main button */}
        {date && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        )}

        {/* Calendar Dropdown */}
        {open && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
              />
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}