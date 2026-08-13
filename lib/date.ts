const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateLongJP(dateStr: string): string {
  const date = parseDateStr(dateStr);
  const weekday = WEEKDAYS_JA[date.getDay()];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekday}）`;
}

export function formatDateShortJP(dateStr: string): string {
  const date = parseDateStr(dateStr);
  const weekday = WEEKDAYS_JA[date.getDay()];
  return `${date.getMonth() + 1}月${date.getDate()}日（${weekday}）`;
}
