import type { AttendanceRecord } from "../../data/types";

interface RecentAttendanceRowProps {
    record: AttendanceRecord;
}

function statusBadgeClasses(status: string) {
    switch (status) {
        case "present":
            return "bg-emerald-50 text-emerald-600";
        case "late":
            return "bg-amber-50 text-amber-600";
        case "half-day":
            return "bg-indigo-50 text-indigo-600";
        case "absent":
            return "bg-rose-50 text-rose-600";
        default:
            return "bg-slate-50 text-slate-500";
    }
}


const RecentAttendanceRow: React.FC<RecentAttendanceRowProps> = ({ record }) => {
    const dateLabel = new Date(record.date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        weekday: "short",
    });

    return (
        <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex flex-col">
                <span className="font-medium text-slate-800">{dateLabel}</span>
                <span className="text-[11px] text-slate-400">
                    {record.checkInTime
                        ? `In: ${new Date(record.checkInTime).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}`
                        : "No check-in"}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500">
                    {record.totalHours ? `${record.totalHours.toFixed(2)} h` : "--"}
                </span>
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClasses(
                        record.status
                    )}`}
                >
                    {record.status}
                </span>
            </div>
        </div>
    );
};

export default RecentAttendanceRow;