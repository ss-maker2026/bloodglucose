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
  createdAt: string;
  updatedAt: string;
};
