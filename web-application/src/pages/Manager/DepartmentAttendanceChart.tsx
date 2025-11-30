import { useMemo } from "react";
import type { AttendanceRecord } from "../../data/types";

interface DepartmentAttendanceChartProps {
  records: AttendanceRecord[];
}

interface DeptAgg {
  department: string;
  count: number;
}

export default function DepartmentAttendanceChart({
  records,
}: DepartmentAttendanceChartProps) {
  const data: DeptAgg[] = useMemo(() => {
    const map = new Map<string, number>();

    records.forEach((r) => {
      const dept = r.userId?.department || "Unknown";
      map.set(dept, (map.get(dept) || 0) + 1);
    });

    return Array.from(map.entries()).map(([department, count]) => ({
      department,
      count,
    }));
  }, [records]);

  const maxVal = data.reduce((m, d) => Math.max(m, d.count), 1);

  return (
    <div className="bg-white rounded-xl flex flex-col justify-center h-full p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Attendance by Department</h3>
        <p className="text-xs text-slate-400">Based on recent days</p>
      </div>

      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.department} className="flex items-center gap-3">
            <div className="w-28 text-xs text-slate-500">{d.department}</div>
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${(d.count / maxVal) * 100 || 4}%` }}
              />
            </div>
            <div className="w-10 text-xs text-slate-600 text-right">{d.count}</div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-xs text-slate-400">No department data available.</p>
        )}
      </div>
    </div>
  );
}
