import type { AttendanceRecord } from "../../data/types";

interface AbsentEmployeesTableProps {
  records: AttendanceRecord[];
  onExportCsv?: () => void;
}

export default function AbsentEmployeesTable({
  records,
  onExportCsv,
}: AbsentEmployeesTableProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Attendance</h3>

        <div className="flex gap-3">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Export as CSV
            </button>
          )}
          <button className="px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
            Full View
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 pr-4">Employee</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Department</th>
              <th className="py-2 pr-4">Check in</th>
              <th className="py-2 pr-4">Check out</th>
              <th className="py-2 pr-4 text-right">Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-slate-400">
                  No absent employees today 🎉
                </td>
              </tr>
            )}

            {records.map((r) => (
              <tr
                key={r._id}
                className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                      {r.userId?.name?.[0] || "E"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-700 font-medium">
                        {r.userId?.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {r.userId?.employeeId}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 pr-4 text-slate-600">
                  {new Date(r.date).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>

                <td className="py-3 pr-4 text-slate-600">
                  {r.userId?.department || "-"}
                </td>

                <td className="py-3 pr-4 text-slate-600">
                  {r.checkInTime
                    ? new Date(r.checkInTime).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </td>

                <td className="py-3 pr-4 text-slate-600">
                  {r.checkOutTime
                    ? new Date(r.checkOutTime).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </td>

                <td className="py-3 pr-4 text-right text-slate-700">
                  {r.totalHours ? `${r.totalHours.toFixed(1)}h` : "0h"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* simple footer placeholder for pagination if you need it later */}
      <div className="mt-3 text-[11px] text-slate-400 flex justify-between">
        <span>Showing {records.length} employees</span>
        <span>Pagination coming soon</span>
      </div>
    </div>
  );
}
