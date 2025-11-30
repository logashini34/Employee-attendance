import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";
import Attendance from "../models/AttendanceModel";
import { ApiError } from "../utils/types/errors";
import { ApiMessages } from "../utils/types/apiMessages";
import { startOfDay } from "../utils/helpers";

// @desc   Check in for today
// @route  POST /api/attendance/checkin
// @access Private (employee)
export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const userId = req.user._id;
  const now = new Date();
  const today = startOfDay(now);

  let attendance = await Attendance.findOne({ userId, date: today });

  if (attendance && attendance.checkInTime) {
    // already checked in
    throw new ApiError(ApiMessages.ATTENDANCE_ALREADY_CHECKED_IN);
  }

  // Determine status (basic version: always "present"; you can implement late logic later)
  const status: "present" | "absent" | "late" | "half-day" = "present";

  if (!attendance) {
    attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime: now,
      status,
      totalHours: 0,
    });
  } else {
    attendance.checkInTime = now;
    attendance.status = status;
    await attendance.save();
  }

  res.status(200).json({
    success: true,
    message: "Checked in successfully",
    attendance,
  });
});

// @desc   Check out for today
// @route  POST /api/attendance/checkout
// @access Private (employee)
export const checkOut = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const userId = req.user._id;
  const now = new Date();
  const today = startOfDay(now);

  const attendance = await Attendance.findOne({ userId, date: today });

  if (!attendance || !attendance.checkInTime) {
    throw new ApiError(ApiMessages.ATTENDANCE_CHECKIN_REQUIRED);
  }

  if (attendance.checkOutTime) {
    throw new ApiError(ApiMessages.ATTENDANCE_ALREADY_CHECKED_OUT);
  }

  attendance.checkOutTime = now;

  const diffMs = attendance.checkOutTime.getTime() - attendance.checkInTime.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  attendance.totalHours = Number(hours.toFixed(2));

  await attendance.save();

  res.status(200).json({
    success: true,
    message: "Checked out successfully",
    attendance,
  });
});

// @desc   Get my attendance history
// @route  GET /api/attendance/my-history
// @access Private (employee)
export const getMyHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const userId = req.user._id;

  // Optional filters: month/year
  const month = req.query.month as string | undefined; // format: "YYYY-MM"
  let match: any = { userId: new Types.ObjectId(userId) };

  if (month) {
    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const m = Number(monthStr) - 1; // 0-based
    const from = new Date(year, m, 1);
    const to = new Date(year, m + 1, 0, 23, 59, 59, 999);
    match.date = { $gte: from, $lte: to };
  }

  const history = await Attendance.find(match).sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    history,
  });
});

// @desc   Get my monthly summary (present/absent/late/half-day + total hours)
// @route  GET /api/attendance/my-summary
// @access Private (employee)
export const getMySummary = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const userId = req.user._id;

  const now = new Date();
  const monthParam = req.query.month as string | undefined; // "YYYY-MM", optional

  let from: Date;
  let to: Date;

  if (monthParam) {
    const [yearStr, monthStr] = monthParam.split("-");
    const year = Number(yearStr);
    const m = Number(monthStr) - 1;
    from = new Date(year, m, 1);
    to = new Date(year, m + 1, 0, 23, 59, 59, 999);
  } else {
    // current month by default
    from = new Date(now.getFullYear(), now.getMonth(), 1);
    to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const agg = await Attendance.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        date: { $gte: from, $lte: to },
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
    summary.totalHours += row.totalHours;
    summary.totalDays += row.count;
  }

  res.status(200).json({
    success: true,
    from,
    to,
    summary,
  });
});

// @desc   Get today's attendance status for me
// @route  GET /api/attendance/today
// @access Private (employee)
export const getTodayStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const userId = req.user._id;
  const today = startOfDay();

  const attendance = await Attendance.findOne({
    userId,
    date: today,
  });

  if (!attendance) {
    // not checked in today
    res.status(200).json({
      success: true,
      status: "not-marked",
      attendance: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    status: attendance.status,
    attendance,
  });
});
