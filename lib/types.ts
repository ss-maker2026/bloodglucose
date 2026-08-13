export type Timing =
  | "breakfast_before"
  | "breakfast_after"
  | "lunch_before"
  | "lunch_after"
  | "dinner_before"
  | "dinner_after";

export type GlucoseRecord = {
  id: string;
  date: string; // "YYYY-MM-DD"
  timing: Timing;
  glucose: number;
  // 保存時点の目標値。未設定（既存データ）の場合は現在の目標値設定から表示時に判定する。
  targetValue?: number;
  createdAt: string;
  updatedAt: string;
};
