// src/models/AttendanceModel.ts
import { Schema, model, Document, Types } from "mongoose";

export type AttendanceStatus = "present" | "absent" | "late" | "half-day";

export interface IAttendance extends Document {
  userId: Types.ObjectId; // ref to User._id
  date: Date;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  status: AttendanceStatus;
  totalHours: number;
  createdAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day"],
      required: true,
      default: "present",
    },

    totalHours: {
      type: Number,
      required: true,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // we use createdAt manually; enable if you want updatedAt too
  }
);

AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true }); // one record per user per day

const Attendance = model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
