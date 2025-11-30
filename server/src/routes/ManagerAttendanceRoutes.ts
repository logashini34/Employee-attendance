import { Router } from "express";
import { authenticateManager } from "../middleware/authMiddleware";
import {
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendanceCsv,
  getTodayTeamStatus,
} from "../controllers/ManagerAttendanceController";

const router = Router();

router.get("/all", authenticateManager, getAllAttendance);

router.get("/employee/:id", authenticateManager, getEmployeeAttendance);

router.get("/summary", authenticateManager, getTeamSummary);

router.get("/export", authenticateManager, exportAttendanceCsv);

router.get("/today-status", authenticateManager, getTodayTeamStatus);

export default router;
