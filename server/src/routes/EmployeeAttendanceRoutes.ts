import { Router } from "express";
import authenticateJWT from "../middleware/authMiddleware";
import {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
} from "../controllers/EmployeeAttendanceController";

const router = Router();

router.post("/checkin", authenticateJWT, checkIn);

router.post("/checkout", authenticateJWT, checkOut);

router.get("/my-history", authenticateJWT, getMyHistory);

router.get("/my-summary", authenticateJWT, getMySummary);

router.get("/today", authenticateJWT, getTodayStatus);

export default router;
