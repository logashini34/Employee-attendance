// src/components/TodayStatusCard.tsx
import { Clock, CheckCircle2, LogIn, LogOut } from "lucide-react";

type StatusKind = "not-marked" | "present" | "absent" | "late" | "half-day";

interface TodayStatusCardProps {
    status: StatusKind;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    totalHours?: number;
    onPrimaryAction: () => Promise<void> | void;
    isActionLoading?: boolean;
}

function formatTime(time?: string | null) {
    if (!time) return "--";
    const d = new Date(time);
    return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function TodayStatusCard({
    status,
    checkInTime,
    checkOutTime,
    totalHours,
    onPrimaryAction,
    isActionLoading,
}: TodayStatusCardProps) {
    const isCheckedIn = !!checkInTime && !checkOutTime;
    const isCompleted = !!checkInTime && !!checkOutTime;

    let label = "Not Checked In";
    let pillClass = "bg-slate-100 text-slate-700";
    if (status === "present" && isCheckedIn) {
        label = "Checked In";
        pillClass = "bg-emerald-50 text-emerald-600";
    } else if (status === "present" && isCompleted) {
        label = "Checked Out";
        pillClass = "bg-sky-50 text-sky-600";
    } else if (status === "late") {
        label = "Late";
        pillClass = "bg-amber-50 text-amber-600";
    } else if (status === "half-day") {
        label = "Half Day";
        pillClass = "bg-indigo-50 text-indigo-600";
    } else if (status === "absent") {
        label = "Marked Absent";
        pillClass = "bg-rose-50 text-rose-600";
    }

    const canCheckIn = status === "not-marked";
    const canCheckOut = status === "present" && isCheckedIn;

    let buttonLabel = "Check In";
    let buttonIcon = <LogIn size={16} />;
    let buttonDisabled = !canCheckIn && !canCheckOut;

    if (canCheckOut) {
        buttonLabel = "Check Out";
        buttonIcon = <LogOut size={16} />;
    }

    if (isCompleted || status === "absent") {
        buttonLabel = "Attendance Completed";
        buttonIcon = <CheckCircle2 size={16} />;
        buttonDisabled = true;
    }

    return (
        <div className="w-full bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Today&apos;s status
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-sm ${pillClass}`}>
                            {label}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>{new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <span>
                        Check-in: <span className="font-semibold text-slate-800">{formatTime(checkInTime)}</span>
                    </span>
                    <span>
                        Check-out: <span className="font-semibold text-slate-800">{formatTime(checkOutTime)}</span>
                    </span>
                    <span>
                        Today&apos;s hours:{" "}
                        <span className="font-semibold text-slate-800">
                            {totalHours != null ? `${totalHours.toFixed(2)} h` : "--"}
                        </span>
                    </span>
                </div>

                { !isCompleted && <button
                    type="button"
                    disabled={buttonDisabled || isActionLoading}
                    onClick={onPrimaryAction}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all ${buttonDisabled
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                        }`}
                >
                    {isActionLoading ? "Please wait..." : buttonLabel}
                    {!isActionLoading && buttonIcon}
                </button>}
            </div>
        </div>
    );
}
