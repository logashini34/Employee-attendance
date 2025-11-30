export interface AttendanceRecord {
    _id: string;
    userId: UserLite;
    date: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    status: 'present' | 'absent' | 'late' | 'half-day' | string;
    totalHours: number;
    createdAt?: string;
    __v?: number;
}

export type AttendanceStatus = "present" | "absent" | "late" | "half-day";

export interface AttendanceHistoryResponse {
    success: boolean;
    count: number;
    history: AttendanceRecord[];
}

export interface AttendanceSummary {
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    totalDays: number;
    totalHours: number;
}

export interface TodayStatusResponse {
    success: boolean;
    status: AttendanceStatus | "not-marked";
    attendance: AttendanceRecord | null;
}

export interface UserLite {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
    department: string;
}

export interface TodayTeamStatusResponse {
    success: boolean;
    from: string;
    to: string;
    summary: {
        present: number;
        absent: number;
        late: number;
        halfDay: number;
        total: number;
    };
    records: AttendanceRecord[];
}

export interface TeamSummaryResponse {
    success: boolean;
    from: string;
    to: string;
    summary: {
        present: number;
        absent: number;
        late: number;
        halfDay: number;
        totalDays: number;
        totalHours: number;
    };
}

export interface AttendanceRangeResponse {
    success: boolean;
    count: number;
    records: AttendanceRecord[];
}