// src/pages/manager/ManagerDashboard.tsx

import { useEffect, useMemo, useState } from "react";
import useManagerDashboardApi from "../../core/api/manager_dashboard_api";
import ManagerStatCard from "../../components/ManagerStatCard";
import WeeklyTrendChart from "../../components/WeeklyTrendCard";
import type { AttendanceRecord } from "../../data/types";
import AbsentEmployeesTable from "./AbsentEmployeesTable";
import DepartmentAttendanceChart from "./DepartmentAttendanceChart";
import { ManagerNavbar, ManagerSidebar } from "./ManagerAsides";

export default function ManagerDashboard() {
  const { getTodayTeamStatus, getAttendanceRange, downloadCsv } =
    useManagerDashboardApi();

  const [isLoading, setIsLoading] = useState(true);
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [rangeRecords, setRangeRecords] = useState<AttendanceRecord[]>([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [_, setLateCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    document.title = "Manager Dashboard - Attendance";

    const load = async () => {
      try {
        setIsLoading(true);

        const now = new Date();
        const todayStr = now.toISOString().substring(0, 10);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const fromStr = sevenDaysAgo.toISOString().substring(0, 10);

        const [todayRes, rangeRes] = await Promise.all([
          getTodayTeamStatus(),
          getAttendanceRange(fromStr, todayStr),
        ]);

        setTodayRecords(todayRes.records);
        setRangeRecords(rangeRes.records);

        setPresentCount(todayRes.summary.present);
        setAbsentCount(todayRes.summary.absent);
        setLateCount(todayRes.summary.late);
        setTotalEmployees(todayRes.summary.total);
      } catch (err) {
        console.error("Failed to load manager dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const absentToday = useMemo(
    () => todayRecords.filter((r) => r.status === "absent"),
    [todayRecords]
  );
  const lateToday = useMemo(
    () => todayRecords.filter((r) => r.status === "late"),
    [todayRecords]
  );

  return (
    <main className="flex w-screen h-screen">
      {/* Left sidebar, same style family as employee dashboard */}
      <ManagerSidebar />

      {/* Right side: navbar + content */}
      <section className="flex-1 flex flex-col">
        <ManagerNavbar
          title="Employee Attendance"
          subtitleLeft="Overview of today’s workforce and weekly attendance trends."
          subtitleRight="Manager · Admin"
          hasNotification={true}
        />

        <section className="flex-1 px-8 py-8 space-y-6 bg-slate-50 rounded-tl-4xl">
          {/* top stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <ManagerStatCard
              label="Total Employees"
              value={totalEmployees}
              accentColor="bg-emerald-50 text-emerald-600"
            />
            <ManagerStatCard
              label="Present Workforce"
              value={presentCount}
              accentColor="bg-blue-50 text-blue-600"
            />
            <ManagerStatCard
              label="Absent Workforce"
              value={absentCount}
              accentColor="bg-rose-50 text-rose-600"
            />
            <ManagerStatCard
              label="Late Arrivals Today"
              value={lateToday.length}
              accentColor="bg-amber-50 text-amber-600"
              subtitle="Employees marked as late"
            />
          </div>

          {/* charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-64 animate-pulse" />
              ) : (
                <WeeklyTrendChart records={rangeRecords} />
              )}
            </div>
            <div className="lg:col-span-1">
              {isLoading ? (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-64 animate-pulse" />
              ) : (
                <DepartmentAttendanceChart records={rangeRecords} />
              )}
            </div>
          </div>

          {/* table */}
          {isLoading ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-64 animate-pulse" />
          ) : (
            <AbsentEmployeesTable
              records={absentToday}
              onExportCsv={() => downloadCsv()}
            />
          )}
        </section>
      </section>
    </main>
  );
}
