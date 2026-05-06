export const PRODUCT_NAMES: Record<string, string> = {
  'habit-tracker': 'Трекер привычек',
  'task-tracker': 'Трекер задач',
  'budget': 'Финансовый планер',
  'planer-week': 'Планер на неделю',
  'pink-habit-tracker': 'Розовый трекер привычек',
  'bundle-all': 'Все таблицы',
}

export function productName(id: string | null | undefined): string {
  if (!id) return '—'
  return PRODUCT_NAMES[id] ?? id
}

export const STATUS_LABELS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  paid: { label: 'Оплачен', tone: 'success' },
  pending: { label: 'В ожидании', tone: 'warning' },
  pending_reminded: { label: 'Напоминание отправлено', tone: 'warning' },
  failed: { label: 'Ошибка', tone: 'danger' },
  refunded: { label: 'Возврат', tone: 'neutral' },
}

export function statusInfo(status: string | null | undefined) {
  if (!status) return { label: '—', tone: 'neutral' as const }
  return STATUS_LABELS[status] ?? { label: status, tone: 'neutral' as const }
}

export function formatTenge(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return `${amount.toLocaleString('ru-RU')} ₸`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
