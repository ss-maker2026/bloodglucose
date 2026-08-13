"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GlucoseRecord, Timing } from "@/lib/types";
import { TIMINGS, getTimingLabel } from "@/lib/timing";
import { loadRecords, saveRecords, findRecord, upsertRecord, deleteRecord } from "@/lib/storage";
import { todayStr } from "@/lib/date";

function isValidTiming(value: string | null): value is Timing {
  return !!value && TIMINGS.some((t) => t.id === value);
}

export default function RecordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = todayStr();

  const rawTiming = searchParams.get("timing");
  const timing: Timing | null = isValidTiming(rawTiming) ? rawTiming : null;
  const initialDate = searchParams.get("date") || today;

  const [records, setRecords] = useState<GlucoseRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [glucoseInput, setGlucoseInput] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!timing) {
      router.replace("/");
    }
  }, [timing, router]);

  const existingRecord = useMemo(() => {
    if (!timing) return undefined;
    return findRecord(records, selectedDate, timing);
  }, [records, selectedDate, timing]);

  useEffect(() => {
    setGlucoseInput(existingRecord ? String(existingRecord.glucose) : "");
    setError("");
  }, [existingRecord]);

  if (!timing || !loaded) return null;

  const handleSave = () => {
    const trimmed = glucoseInput.trim();
    if (trimmed === "") {
      setError("血糖値を入力してください");
      return;
    }
    const value = Number(trimmed);
    if (!Number.isInteger(value) || value < 0 || value > 999) {
      setError("0〜999の整数で入力してください");
      return;
    }

    const updated = upsertRecord(records, selectedDate, timing, value);
    saveRecords(updated);
    router.push("/");
  };

  const handleDelete = () => {
    if (!existingRecord) return;
    const updated = deleteRecord(records, existingRecord.id);
    saveRecords(updated);
    router.back();
  };

  return (
    <main className="px-5 pt-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="戻る"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current stroke-[2]">
          <path d="M12 4 6 10l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="mt-4 text-center text-2xl font-bold text-slate-800">
        {getTimingLabel(timing)}
      </h1>

      <div className="mt-3 flex justify-center">
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value || today)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 outline-none focus:border-accent"
        />
      </div>

      <div className="mt-10 flex flex-col items-center">
        <label htmlFor="glucose" className="mb-2 text-sm font-medium text-slate-400">
          血糖値
        </label>
        <div className="flex items-baseline gap-2">
          <input
            id="glucose"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            max={999}
            step={1}
            value={glucoseInput}
            onChange={(e) => {
              setGlucoseInput(e.target.value);
              setError("");
            }}
            placeholder="—"
            autoFocus
            className="w-44 border-b-4 border-accent-light bg-transparent text-center text-6xl font-bold text-slate-800 outline-none placeholder:text-slate-300 focus:border-accent"
          />
          <span className="text-xl font-medium text-slate-400">mg/dL</span>
        </div>
        {error && <p className="mt-4 text-sm font-medium text-red-500">{error}</p>}
      </div>

      <div className="mt-12 flex flex-col gap-3 pb-8">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-2xl bg-accent py-4 text-lg font-bold text-white shadow-md shadow-accent/30 transition-transform active:scale-[0.98]"
        >
          保存
        </button>
        {existingRecord && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-red-200 hover:text-red-500"
          >
            この記録を削除する
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-6">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl">
            <p className="text-base font-medium text-slate-700">
              この記録を削除しますか？
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
