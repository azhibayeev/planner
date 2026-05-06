// KZ-телефон: формат национального номера "(XXX) XXX-XX-XX".
// Префикс +7 показывается снаружи инпута и не редактируется.
// На submit мы достаём 10 цифр и шлём как "+7XXXXXXXXXX" — API checkout их нормализует.

export function formatNationalPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  // Если вставили номер с country code (+7XXX или 8XXX, итого 11 цифр) —
  // отбрасываем первую.
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    digits = digits.slice(1)
  }
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''

  let r = '(' + digits.slice(0, 3)
  if (digits.length >= 3) r += ')'
  if (digits.length > 3) r += ' ' + digits.slice(3, 6)
  if (digits.length > 6) r += '-' + digits.slice(6, 8)
  if (digits.length > 8) r += '-' + digits.slice(8, 10)
  return r
}

/** Возвращает 10 цифр национального номера (без +7) или null если неполный. */
export function getNationalDigits(formatted: string): string | null {
  const digits = formatted.replace(/\D/g, '')
  return digits.length === 10 ? digits : null
}

/** Полный E.164 формат для отправки в API. */
export function toE164(formatted: string): string {
  const digits = formatted.replace(/\D/g, '')
  return digits ? `+7${digits}` : ''
}
