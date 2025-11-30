// src/core/manager_dashboard_api.ts
import type { TodayTeamStatusResponse, TeamSummaryResponse, AttendanceRangeResponse, AttendanceRecord } from "../../data/types";
import { apiFetch } from "./api_configs";

export default function useManagerDashboardApi() {
    async function getTodayTeamStatus(): Promise<TodayTeamStatusResponse> {
        const res = await apiFetch("/attendance/today-status");

        if (!res.ok) throw new Error("Failed to load today's team status");
        return res.json();
    }

    async function getTeamSummary(from?: string, to?: string): Promise<TeamSummaryResponse> {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);

        const res = await apiFetch(`/attendance/summary?${params.toString()}`);

        if (!res.ok) throw new Error("Failed to load team summary");
        return res.json();
    }

    async function getAttendanceRange(from: string, to: string): Promise<AttendanceRangeResponse> {
        const params = new URLSearchParams({ from, to });

        const res = await apiFetch(`/attendance/all?${params.toString()}`);

        if (!res.ok) throw new Error("Failed to load attendance records");
        const data = await res.json();
        return {
            success: true,
            count: data.count,
            records: data.records as AttendanceRecord[],
        };
    }

    async function downloadCsv(from?: string, to?: string) {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);

        const res = await apiFetch(`/attendance/export?${params.toString()}`);

        if (!res.ok) throw new Error("Failed to export CSV");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attendance.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return {
        getTodayTeamStatus,
        getTeamSummary,
        getAttendanceRange,
        downloadCsv,
    };
}
