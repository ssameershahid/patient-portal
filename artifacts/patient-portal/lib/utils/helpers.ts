export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 || 12
  return `${hour12}:${minutes}${ampm}`
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short' })
}

export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = []
  const start = new Date(startDate)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)

  for (let i = 0; i < 5; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
}
