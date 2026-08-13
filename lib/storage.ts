import type { GlucoseRecord, Timing } from "@/lib/types";
import { DEFAULT_TARGETS } from "@/lib/targets";

const STORAGE_KEY = "glucose-app:records";

// アプリの旧初期設定（食前100mg/dL以下）で保存された記録を、新しい初期設定
// （食前95mg/dL以下）に合わせて更新する。目標値設定にまだカスタムUIがなく、
// 100はすべてアプリ側の旧デフォルト由来と判別できるため一度だけ書き換える。
const LEGACY_BEFORE_MEAL_TARGET = 100;
const BEFORE_MEAL_TIMINGS: Timing[] = [
  "breakfast_before",
  "lunch_before",
  "dinner_before",
];

function migrateBeforeMealTargets(records: GlucoseRecord[]): {
  records: GlucoseRecord[];
  migrated: boolean;
} {
  let migrated = false;
  const next = records.map((r) => {
    if (
      BEFORE_MEAL_TIMINGS.includes(r.timing) &&
      r.targetValue === LEGACY_BEFORE_MEAL_TARGET
    ) {
      migrated = true;
      return { ...r, targetValue: DEFAULT_TARGETS[r.timing] };
    }
    return r;
  });
  return { records: next, migrated };
}

export function loadRecords(): GlucoseRecord[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const { records, migrated } = migrateBeforeMealTargets(parsed);
    if (migrated) saveRecords(records);
    return records;
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
  glucose: number,
  targetValue: number
): GlucoseRecord[] {
  const now = new Date().toISOString();
  const existing = findRecord(records, date, timing);

  if (existing) {
    return records.map((r) =>
      r.id === existing.id ? { ...r, glucose, targetValue, updatedAt: now } : r
    );
  }

  const newRecord: GlucoseRecord = {
    id: crypto.randomUUID(),
    date,
    timing,
    glucose,
    targetValue,
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
