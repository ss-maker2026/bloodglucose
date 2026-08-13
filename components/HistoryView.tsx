"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GlucoseRecord } from "@/lib/types";
import { TIMINGS } from "@/lib/timing";
import { loadRecords } from "@/lib/storage";
import { formatDateShortJP } from "@/lib/date";
import { DEFAULT_TARGETS, loadTargets, getTargetForTiming, isWithinTarget, type TargetSettings } from "@/lib/targets";

export default function HistoryView() {
  const router = useRouter();
  const [records, setRecords] = useState<GlucoseRecord[]>([]);
  const [targets, setTargets] = useState<TargetSettings>(DEFAULT_TARGETS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setTargets(loadTargets());
    setLoaded(true);
  }, []);

  const dates = Array.from(new Set(records.map((r) => r.date))).sort(
    (a, b) => (a < b ? 1 : -1)
  );

  return (
    <main className="px-4 pt-8 sm:pt-10">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">履歴</h1>
      </header>

      {loaded && dates.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
          まだ記録がありません
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {dates.map((date) => (
            <section
              key={date}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100"
            >
              <h2 className="mb-2 text-sm font-bold text-slate-600">
                {formatDateShortJP(date)}
              </h2>
              <div className="flex flex-col divide-y divide-slate-50">
                {TIMINGS.map((t) => {
                  const record = records.find(
                    (r) => r.date === date && r.timing === t.id
                  );
                  const target = record?.targetValue ?? getTargetForTiming(targets, t.id);
                  const within = record ? isWithinTarget(record.glucose, target) : true;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        router.push(`/record?date=${date}&timing=${t.id}`)
                      }
                      className="flex flex-col py-2.5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{t.label}</span>
                        {record ? (
                          <span className="text-base font-bold text-slate-800">
                            {record.glucose}
                            <span className="ml-1 text-xs font-medium text-slate-400">
                              mg/dL
                            </span>
                          </span>
                        ) : (
                          <span className="text-base text-slate-300">—</span>
                        )}
                      </div>
                      {record && (
                        <span
                          className={`self-end text-xs font-semibold ${
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
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
