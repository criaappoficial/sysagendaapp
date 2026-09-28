import { format, parseISO, differenceInMinutes, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Format string date 'YYYY-MM-DD' into readable Portuguese date
 * e.g., '30/09/2026' or '30 de setembro de 2026'
 */
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

export function formatLongDateBR(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatDayOfWeek(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return format(date, 'EEEE', { locale: ptBR })
}

/**
 * Calculate duration in minutes between HH:mm and HH:mm
 */
export function calculateDurationMinutes(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const startTotal = startHour * 60 + startMinute
  const endTotal = endHour * 60 + endMinute

  const diff = endTotal - startTotal
  return diff > 0 ? diff : 0
}

/**
 * Format duration minutes into human readable text (e.g. "1h 30min", "45 min")
 */
export function formatDurationText(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 min'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}min`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins} min`
  }
}

/**
 * Format time range e.g. "14:00 às 15:00"
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return ''
  return `${startTime} às ${endTime}`
}

/**
 * Get current date string in YYYY-MM-DD format using local time
 */
export function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Add days to YYYY-MM-DD date string
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const result = addDays(date, days)
  const resYear = result.getFullYear()
  const resMonth = String(result.getMonth() + 1).padStart(2, '0')
  const resDay = String(result.getDate()).padStart(2, '0')
  return `${resYear}-${resMonth}-${resDay}`
}

/**
 * Add weeks to YYYY-MM-DD date string
 */
export function addWeeksToDateString(dateStr: string, weeks: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const result = addWeeks(date, weeks)
  const resYear = result.getFullYear()
  const resMonth = String(result.getMonth() + 1).padStart(2, '0')
  const resDay = String(result.getDate()).padStart(2, '0')
  return `${resYear}-${resMonth}-${resDay}`
}

/**
 * Add months to YYYY-MM-DD date string
 */
export function addMonthsToDateString(dateStr: string, months: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const result = addMonths(date, months)
  const resYear = result.getFullYear()
  const resMonth = String(result.getMonth() + 1).padStart(2, '0')
  const resDay = String(result.getDate()).padStart(2, '0')
  return `${resYear}-${resMonth}-${resDay}`
}
