import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";
import Attendance from "../models/AttendanceModel";
import User from "../models/UserModel";
import { ApiError } from "../utils/types/errors";
import { ApiMessages } from "../utils/types/apiMessages";
import { startOfDay, endOfDay } from "../utils/helpers";

async function ensureManager(req: Request) {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const user = await User.findById(req.user._id);
  if (!user || user.role !== "MANAGER") {
    throw new ApiError(ApiMessages.FORBIDDEN_MANAGER_ONLY);
  }

  return user;
}

// @desc   Get attendance for all employees (with optional filters)
// @route  GET /api/attendance/all
// @access Private (manager)
export const getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
  await ensureManager(req);

  const { userId, status, from, to } = req.query as {
    userId?: string;
    status?: string;
    from?: string;
    to?: string;
  };

  const match: any = {};

  if (userId) {
    match.userId = new Types.ObjectId(userId);
  }

  if (status) {
    match.status = status;
  }

  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = startOfDay(new Date(from));
    if (to) match.date.$lte = endOfDay(new Date(to));
  }

  const records = await Attendance.find(match)
    .populate("userId", "name email employeeId department")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    records,
  });
});

// @desc   Get attendance for a specific employee
// @route  GET /api/attendance/employee/:id
// @access Private (manager)
export const getEmployeeAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    await ensureManager(req);

    const { id } = req.params;
    const { from, to } = req.query as { from?: string; to?: string };

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(ApiMessages.INVALID_OBJECT_ID);
    }

    const match: any = { userId: new Types.ObjectId(id) };

    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = startOfDay(new Date(from));
      if (to) match.date.$lte = endOfDay(new Date(to));
    }

    const records = await Attendance.find(match)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      userId: id,
      count: records.length,
      records,
    });
  }
);

// @desc   Get team attendance summary for a date range
// @route  GET /api/attendance/summary
// @access Private (manager)
export const getTeamSummary = asyncHandler(async (req: Request, res: Response) => {
  await ensureManager(req);

  const { from, to } = req.query as { from?: string; to?: string };
  const now = new Date();

  const fromDate = from ? startOfDay(new Date(from)) : new Date(now.getFullYear(), now.getMonth(), 1);
  const toDate = to
    ? endOfDay(new Date(to))
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const agg = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: fromDate, $lte: toDate },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalHours: { $sum: "$totalHours" },
      },
    },
  ]);

  const summary = {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    totalDays: 0,
    totalHours: 0,
  };

  for (const row of agg) {
    if (row._id === "present") summary.present = row.count;
    if (row._id === "absent") summary.absent = row.count;
    if (row._id === "late") summary.late = row.count;
    if (row._id === "half-day") summary.halfDay = row.count;
    summary.totalDays += row.count;
    summary.totalHours += row.totalHours;
  }

  res.status(200).json({
    success: true,
    from: fromDate,
    to: toDate,
    summary,
  });
});

// @desc   Export attendance as CSV
// @route  GET /api/attendance/export
// @access Private (manager)
export const exportAttendanceCsv = asyncHandler(
  async (req: Request, res: Response) => {
    await ensureManager(req);

    const { userId, status, from, to } = req.query as {
      userId?: string;
      status?: string;
      from?: string;
      to?: string;
    };

    const match: any = {};

    if (userId) {
      match.userId = new Types.ObjectId(userId);
    }

    if (status) {
      match.status = status;
    }

    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = startOfDay(new Date(from));
      if (to) match.date.$lte = endOfDay(new Date(to));
    }

    const records = await Attendance.find(match)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    const header = [
      "Employee ID",
      "Name",
      "Email",
      "Department",
      "Date",
      "Check In",
      "Check Out",
      "Status",
      "Total Hours",
    ];

    const rows = records.map((rec) => {
      const user = rec.userId as any;
      return [
        user?.employeeId || "",
        user?.name || "",
        user?.email || "",
        user?.department || "",
        rec.date.toISOString(),
        rec.checkInTime ? rec.checkInTime.toISOString() : "",
        rec.checkOutTime ? rec.checkOutTime.toISOString() : "",
        rec.status,
        rec.totalHours.toString(),
      ];
    });

    const csv =
      header.join(",") +
      "\n" +
      rows.map((r) => r.map((v) => `"${v.replace?.(/"/g, '""') || v}"`).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="attendance.csv"');

    res.status(200).send(csv);
  }
);

// @desc   Get today's attendance status for the whole team
// @route  GET /api/attendance/today-status
// @access Private (manager)
export const getTodayTeamStatus = asyncHandler(
  async (req: Request, res: Response) => {
    await ensureManager(req);

    const from = startOfDay();
    const to = endOfDay();

    const records = await Attendance.find({
      date: { $gte: from, $lte: to },
    }).populate("userId", "name email employeeId department");

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      total: records.length,
    };

    for (const rec of records) {
      if (rec.status === "present") summary.present++;
      if (rec.status === "absent") summary.absent++;
      if (rec.status === "late") summary.late++;
      if (rec.status === "half-day") summary.halfDay++;
    }

    res.status(200).json({
      success: true,
      from,
      to,
      summary,
      records,
    });
  }
);
