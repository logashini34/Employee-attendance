import { useMemo, useState } from "react";
import type { AttendanceRecord } from "../data/types";

interface WeeklyTrendChartProps {
    records: AttendanceRecord[];
}

interface DayAgg {
    dateLabel: string;
    present: number;
    absent: number;
    late: number;
}

export default function WeeklyTrendChart({ records }: WeeklyTrendChartProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const data: DayAgg[] = useMemo(() => {
        const byDate = new Map<string, DayAgg>();

        records.forEach((r) => {
            const d = new Date(r.date);
            const key = d.toISOString().substring(0, 10); // YYYY-MM-DD
            const label = d.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                weekday: "short",
            });

            if (!byDate.has(key)) {
                byDate.set(key, { dateLabel: label, present: 0, absent: 0, late: 0 });
            }

            const agg = byDate.get(key)!;
            if (r.status === "present" || r.status === "half-day") agg.present += 1;
            if (r.status === "absent") agg.absent += 1;
            if (r.status === "late") agg.late += 1;
        });

        return Array.from(byDate.values()).slice(-7);
    }, [records]);

    const maxVal = useMemo(
        () =>
            data.reduce((max, d) => Math.max(max, d.present + d.absent + d.late), 1),
        [data]
    );

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Weekly Attendance Trend</h3>
                <p className="text-xs text-slate-400">Last 7 days</p>
            </div>

            <div className="relative h-56">
                {/* grid */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[1, 0.75, 0.5, 0.25, 0].map((t) => (
                        <div key={t} className="flex items-center">
                            <div className="w-8 text-[10px] text-slate-400 text-right pr-2">
                                {Math.round(maxVal * t)}
                            </div>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>
                    ))}
                </div>

                {/* bars */}
                <div className="absolute inset-0 ml-8 flex items-end justify-between px-2 pb-6">
                    {data.map((d, i) => {
                        const total = d.present + d.absent + d.late;
                        const height = `${(total / maxVal) * 100 || 4}%`;

                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center group w-full"
                                onMouseEnter={() => setHoverIndex(i)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <div className="flex flex-col justify-end w-6 md:w-7 h-full">
                                    <div
                                        className="w-full rounded-t bg-emerald-500"
                                        style={{ height }}
                                    />
                                </div>
                                <span className="mt-2 text-[10px] text-slate-500 whitespace-nowrap">
                                    {d.dateLabel}
                                </span>

                                {hoverIndex === i && (
                                    <div className="absolute -top-2 translate-y-[-100%] bg-slate-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-lg">
                                        <p className="font-semibold mb-1">{d.dateLabel}</p>
                                        <p>Present: {d.present}</p>
                                        <p>Late: {d.late}</p>
                                        <p>Absent: {d.absent}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* legend */}
            <div className="flex gap-4 mt-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" /> Present / Late / Absent
                </span>
            </div>
        </div>
    );
}
