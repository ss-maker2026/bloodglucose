import type { Timing } from "@/lib/types";

export const TIMINGS: { id: Timing; label: string }[] = [
  { id: "breakfast_before", label: "朝食前" },
  { id: "breakfast_after", label: "朝食後2時間" },
  { id: "lunch_before", label: "昼食前" },
  { id: "lunch_after", label: "昼食後2時間" },
  { id: "dinner_before", label: "夕食前" },
  { id: "dinner_after", label: "夕食後2時間" },
];

export function getTimingLabel(timing: Timing): string {
  return TIMINGS.find((t) => t.id === timing)?.label ?? timing;
}
