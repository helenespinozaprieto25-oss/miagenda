const SHORT_DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const FULL_DAYS_ES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const SHORT_MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];
const FULL_MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return formatDateISO(new Date());
}

export function addDaysISO(baseDateStr: string, offsetDays: number): string {
  const date = parseLocalDate(baseDateStr);
  date.setDate(date.getDate() + offsetDays);
  return formatDateISO(date);
}

export function formatReadableDate(dateStr: string): string {
  const today = getTodayISO();
  const tomorrow = addDaysISO(today, 1);
  const yesterday = addDaysISO(today, -1);

  if (dateStr === today) return 'Hoy';
  if (dateStr === tomorrow) return 'Mañana';
  if (dateStr === yesterday) return 'Ayer';

  const d = parseLocalDate(dateStr);
  const dayName = SHORT_DAYS_ES[d.getDay()];
  const dayNum = d.getDate();
  const monthName = SHORT_MONTHS_ES[d.getMonth()];
  return `${dayName}, ${dayNum} ${monthName}`;
}

export function formatFullSpanishDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const dayName = FULL_DAYS_ES[d.getDay()];
  const dayNum = d.getDate();
  const monthName = FULL_MONTHS_ES[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
}

export function getWeekDatesFrom(referenceDateStr: string): {
  iso: string;
  shortDay: string;
  dayNumber: number;
  monthShort: string;
}[] {
  const ref = parseLocalDate(referenceDateStr);
  // Start week on Monday (Lunes = 1 ... Domingo = 0 -> 7)
  const dayOfWeek = ref.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push({
      iso: formatDateISO(current),
      shortDay: SHORT_DAYS_ES[current.getDay()],
      dayNumber: current.getDate(),
      monthShort: SHORT_MONTHS_ES[current.getMonth()],
    });
  }
  return days;
}

export function getShortDayLabel(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return SHORT_DAYS_ES[d.getDay()];
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < getTodayISO();
}
