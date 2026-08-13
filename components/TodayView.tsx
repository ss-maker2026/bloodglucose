"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GlucoseRecord } from "@/lib/types";
import { TIMINGS } from "@/lib/timing";
import { loadRecords } from "@/lib/storage";
import { formatDateLongJP, todayStr } from "@/lib/date";
import { DEFAULT_TARGETS, loadTargets, getTargetForTiming, isWithinTarget, type TargetSettings } from "@/lib/targets";

export default function TodayView() {
  const router = useRouter();
  const [records, setRecords] = useState<GlucoseRecord[]>([]);
  const [targets, setTargets] = useState<TargetSettings>(DEFAULT_TARGETS);
  const today = todayStr();

  useEffect(() => {
    setRecords(loadRecords());
    setTargets(loadTargets());
  }, []);

  const recordedCount = TIMINGS.filter((t) =>
    records.some((r) => r.date === today && r.timing === t.id)
  ).length;

  return (
    <main className="px-4 pt-8 sm:pt-10">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">今日の記録</h1>
        <p className="mt-1 text-sm text-slate-400">{formatDateLongJP(today)}</p>
        <p className="mt-1 text-xs text-slate-400">
          {recordedCount} / {TIMINGS.length} 件 記録済み
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {TIMINGS.map((t) => {
          const record = records.find(
            (r) => r.date === today && r.timing === t.id
          );
          const target = record?.targetValue ?? getTargetForTiming(targets, t.id);
          const within = record ? isWithinTarget(record.glucose, target) : true;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                router.push(`/record?date=${today}&timing=${t.id}`)
              }
              className={`flex w-full flex-col rounded-2xl border px-5 py-4 text-left transition-colors active:scale-[0.99] ${
                record
                  ? "border-accent-light bg-accent-light/20"
                  : "border-slate-200 bg-white hover:border-accent/40"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-base font-medium text-slate-700">
                  {t.label}
                </span>
                {record ? (
                  <span className="flex items-baseline gap-2 text-slate-800">
                    <span className="text-2xl font-bold">{record.glucose}</span>
                    <span className="text-xs font-medium text-slate-400">
                      mg/dL
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                    <span className="text-lg leading-none">＋</span>
                    記録する
                  </span>
                )}
              </div>
              {record && (
                <span
                  className={`mt-1 self-end text-xs font-semibold ${
                    within ? "text-accent-dark" : "text-slate-500"
                  }`}
                >
                  {within ? "✓ 目標範囲内" : "目標値を超えています"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
