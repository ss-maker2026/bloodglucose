import type { GlucoseRecord, Timing } from "@/lib/types";

const STORAGE_KEY = "glucose-app:records";

export function loadRecords(): GlucoseRecord[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: GlucoseRecord[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function findRecord(
  records: GlucoseRecord[],
  date: string,
  timing: Timing
): GlucoseRecord | undefined {
  return records.find((r) => r.date === date && r.timing === timing);
}

export function upsertRecord(
  records: GlucoseRecord[],
  date: string,
  timing: Timing,
  glucose: number
): GlucoseRecord[] {
  const now = new Date().toISOString();
  const existing = findRecord(records, date, timing);

  if (existing) {
    return records.map((r) =>
      r.id === existing.id ? { ...r, glucose, updatedAt: now } : r
    );
  }

  const newRecord: GlucoseRecord = {
    id: crypto.randomUUID(),
    date,
    timing,
    glucose,
    createdAt: now,
    updatedAt: now,
  };
  return [...records, newRecord];
}

export function deleteRecord(
  records: GlucoseRecord[],
  id: string
): GlucoseRecord[] {
  return records.filter((r) => r.id !== id);
}
