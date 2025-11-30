// src/core/attendance_dashboard_api.ts
import type { AttendanceHistoryResponse, AttendanceSummary, TodayStatusResponse } from "../../data/types";
import { apiFetch } from "./api_configs";

export default function useAttendanceDashboardApi() {
  async function getHistory(month?: string): Promise<AttendanceHistoryResponse> {
    const params = month ? `?month=${encodeURIComponent(month)}` : "";
    const res = await apiFetch(`/attendance/my-history${params}`);

    if (!res.ok) {
      throw new Error("Failed to fetch attendance history");
    }

    return res.json();
  }

  async function getSummary(month?: string): Promise<AttendanceSummary> {
    const params = month ? `?month=${encodeURIComponent(month)}` : "";
    const res = await apiFetch(`/attendance/my-summary${params}`);

    if (!res.ok) {
      throw new Error("Failed to fetch monthly summary");
    }

    const data = await res.json();
    return data.summary as AttendanceSummary;
  }

  async function getTodayStatus(): Promise<TodayStatusResponse> {
    const res = await apiFetch(`/attendance/today`);

    if (!res.ok) {
      throw new Error("Failed to fetch today's status");
    }

    return res.json();
  }

  async function checkIn() {
    const res = await apiFetch(`/attendance/checkin`, {
      method: "POST",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to check in");
    }

    return res.json();
  }

  async function checkOut() {
    const res = await apiFetch(`/attendance/checkout`, {
      method: "POST",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to check out");
    }

    return res.json();
  }

  return {
    getHistory,
    getSummary,
    getTodayStatus,
    checkIn,
    checkOut,
  };
}
