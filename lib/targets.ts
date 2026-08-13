import type { Timing } from "@/lib/types";

const TARGETS_STORAGE_KEY = "glucose-app:targets";

export type TargetSettings = Record<Timing, number>;

// 医学的な「正常値」ではなく、アプリの初期設定値。主治医の指示に応じて
// 将来的にユーザーが変更できるよう、コードに固定せず設定データとして扱う。
export const DEFAULT_TARGETS: TargetSettings = {
  breakfast_before: 95,
  breakfast_after: 120,
  lunch_before: 95,
  lunch_after: 120,
  dinner_before: 95,
  dinner_after: 120,
};

export function loadTargets(): TargetSettings {
  try {
    const stored = window.localStorage.getItem(TARGETS_STORAGE_KEY);
    if (!stored) return { ...DEFAULT_TARGETS };
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_TARGETS, ...parsed };
  } catch {
    return { ...DEFAULT_TARGETS };
  }
}

export function saveTargets(targets: TargetSettings): void {
  window.localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(targets));
}

export function getTargetForTiming(
  targets: TargetSettings,
  timing: Timing
): number {
  return targets[timing] ?? DEFAULT_TARGETS[timing];
}

// 目標値は「以下」を範囲内とする（100が目標値なら100は範囲内、101は超過）。
export function isWithinTarget(glucose: number, target: number): boolean {
  return glucose <= target;
}
