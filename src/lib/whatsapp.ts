/** 0812-3456-7890 / +62 812 3456 7890 -> 6281234567890 (formato aceptado por wa.me) */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

export function waLink(text: string, phone?: string): string {
  const to = phone ? normalizePhone(phone) : '';
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
