// src/pages/employee/Dashboard.tsx
import {
    AlarmClock,
    CalendarDays,
    CheckCircle,
    CircleDashed,
    Clock,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AttendanceChart from "./AttendanceChart";
import StatCard from "../../components/StatCard";
import TodayStatusCard from "../../components/TodayStatusCard";
import useAttendanceDashboardApi from "../../core/api/attendance_dashboard_api";
import useAuthApi from "../../core/api/authentication_api";
import RecentAttendanceRow from "./RecentAttendanceSection";
import { DashboardSidebar, DashboardNavbar } from "./EmployeeAsides";
import type { AttendanceHistoryResponse, AttendanceSummary, AttendanceRecord } from "../../data/types";

const EMPTY_HISTORY: AttendanceHistoryResponse = {
    success: true,
    count: 0,
    history: [],
};

const EMPTY_SUMMARY: AttendanceSummary = {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    totalDays: 0,
    totalHours: 0,
};

export default function EmployeeDashboard() {
    const [history, setHistory] = useState<AttendanceHistoryResponse>(EMPTY_HISTORY);
    const [summary, setSummary] = useState<AttendanceSummary>(EMPTY_SUMMARY);
    const [today, setToday] = useState<{
        status: "present" | "absent" | "late" | "half-day" | "not-marked";
        attendance: AttendanceRecord | null;
    }>({ status: "not-marked", attendance: null });

    const [navbarUserName, setNavbarUserName] = useState<string>("Employee");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

    const attendanceApi = useAttendanceDashboardApi();
    const { getCurrentUser } = useAuthApi();

    // Derived navbar data (date + shift)
    const navbarData = useMemo(() => {
        const todayLabel = new Date().toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        let shiftName = "Not Checked In";
        let shiftTime = "--";

        if (today.attendance?.checkInTime) {
            const t = new Date(today.attendance.checkInTime);
            shiftName = today.status === "late" ? "Late Check-In" : "Checked-In";
            shiftTime = t.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        }

        if (today.attendance?.checkOutTime) {
            const t = new Date(today.attendance.checkOutTime);
            shiftName = "Checked-Out";
            shiftTime = t.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        }

        return {
            date: todayLabel,
            shiftName,
            shiftTime,
            userName: navbarUserName,
            userAvatarUrl:
                `https://placehold.co/500x500?text=AJ`,
            hasNotification: false,
        };
    }, [today, navbarUserName]);

    const employeeStats = useMemo(
        () => [
            {
                title: "Present Days",
                value: summary.present,
                icon: <CheckCircle />,
            },
            {
                title: "Absent Days",
                value: summary.absent,
                icon: <X />,
            },
            {
                title: "Late Days",
                value: summary.late,
                icon: <AlarmClock />,
            },
            {
                title: "Half Days",
                value: summary.halfDay,
                icon: <CircleDashed />,
            },
            {
                title: "Total Working Days",
                value: summary.totalDays,
                icon: <CalendarDays />,
            },
            {
                title: "Total Hours Worked",
                value: summary.totalHours.toFixed(2),
                icon: <Clock />,
            },
        ],
        [summary]
    );

    // Load dashboard data
    useEffect(() => {
        document.title = "Employee Dashboard";

        const load = async () => {
            try {
                setIsLoading(true);

                const now = new Date();
                const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

                const [summaryRes, historyRes, todayRes, userRes] = await Promise.all([
                    attendanceApi.getSummary(monthStr),
                    attendanceApi.getHistory(monthStr),
                    attendanceApi.getTodayStatus(),
                    getCurrentUser(),
                ]);

                setSummary(summaryRes);
                setHistory(historyRes);
                setToday({
                    status: todayRes.status,
                    attendance: todayRes.attendance,
                });

                if (userRes?.user?.name) {
                    setNavbarUserName(userRes.user.name);
                }
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleQuickAction = async () => {
        try {
            if (isActionLoading) return;
            setIsActionLoading(true);

            // Decide whether to check-in or check-out.
            const canCheckIn = today.status === "not-marked";
            const canCheckOut = today.status === "present" && !!today.attendance?.checkInTime && !today.attendance?.checkOutTime;

            if (!canCheckIn && !canCheckOut) {
                return;
            }

            if (canCheckIn) {
                await attendanceApi.checkIn();
            } else if (canCheckOut) {
                await attendanceApi.checkOut();
            }

            // Refresh dashboard data after action
            const now = new Date();
            const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

            const [summaryRes, historyRes, todayRes] = await Promise.all([
                attendanceApi.getSummary(monthStr),
                attendanceApi.getHistory(monthStr),
                attendanceApi.getTodayStatus(),
            ]);

            setSummary(summaryRes);
            setHistory(historyRes);
            setToday({
                status: todayRes.status,
                attendance: todayRes.attendance,
            });
        } catch (err) {
            console.error("Quick action error:", err);
            alert((err as Error).message || "Unable to update attendance.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const recentAttendance = useMemo(() => {
        return [...history.history]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7);
    }, [history]);

    return (
        <main className="flex w-screen h-screen bg-slate-100">
            {/* sidebar */}
            <DashboardSidebar />

            <section className="flex-1 flex flex-col">
                {/* navbar */}
                <DashboardNavbar {...navbarData} />

                {/* main section */}
                <div className="flex-1 bg-[#f3f5f7] rounded-tl-4xl flex gap-6 pr-12">
                    {/* Left: Chart + recent attendance */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="p-8">
                                    <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
                                </div>
                            ) : (
                                <AttendanceChart data={history} />
                            )}
                        </div>

                        {/* Recent attendance list */}
                        <div className="px-8 pr-0 pb-8">
                            <div className="bg-white rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-slate-800">Recent Attendance</h3>
                                    <span className="text-xs text-slate-400">Last 7 days</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentAttendance.length === 0 && (
                                        <p className="text-xs text-slate-400 py-2">No attendance records yet.</p>
                                    )}
                                    {recentAttendance.map((item) => (
                                        <RecentAttendanceRow key={item._id} record={item} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Today card + stats */}
                    <div className="flex flex-col py-8 gap-5 w-80">
                        <TodayStatusCard
                            status={today.status}
                            checkInTime={today.attendance?.checkInTime || null}
                            checkOutTime={today.attendance?.checkOutTime || null}
                            totalHours={today.attendance?.totalHours}
                            onPrimaryAction={handleQuickAction}
                            isActionLoading={isActionLoading}
                        />

                        <div className="flex flex-col gap-4">
                            {employeeStats.map((item, index) => (
                                <StatCard {...item} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}






