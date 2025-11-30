// src/seeds/seedDatabase.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/UserModel";
import Attendance from "../models/AttendanceModel";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/employee-management-system";

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

async function clearCollections() {
    await Attendance.deleteMany({});
    await User.deleteMany({ role: "EMPLOYEE" }); // only clear employees, keep managers if any
    console.log("🧹 Cleared Attendance and Employee documents");
}

async function seedEmployees() {
    const plainPassword = "password123"; // demo password for all employees
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const employees = [
        {
            name: "Alice Johnson",
            email: "alice@example.com",
            password: hashedPassword,
            role: "EMPLOYEE",
            employeeId: "EMP001",
            department: "Engineering",
        },
        {
            name: "Bob Smith",
            email: "bob@example.com",
            password: hashedPassword,
            role: "EMPLOYEE",
            employeeId: "EMP002",
            department: "Design",
        },
        {
            name: "Charlie Brown",
            email: "charlie@example.com",
            password: hashedPassword,
            role: "EMPLOYEE",
            employeeId: "EMP003",
            department: "Marketing",
        },
        {
            name: "Diana Prince",
            email: "diana@example.com",
            password: hashedPassword,
            role: "EMPLOYEE",
            employeeId: "EMP004",
            department: "HR",
        },
    ];

    const createdEmployees = await User.insertMany(employees);
    console.log(`👥 Seeded ${createdEmployees.length} employees`);

    return createdEmployees;
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedAttendance(employees: any[]) {
    const today = new Date();

    const attendanceDocs: any[] = [];

    for (const emp of employees) {
        // last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

            // make weekends mostly absent
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const shouldBePresent = isWeekend ? Math.random() < 0.3 : Math.random() < 0.9;

            // randomly skip some days (no attendance record at all)
            if (Math.random() < 0.05) {
                continue;
            }

            if (!shouldBePresent) {
                attendanceDocs.push({
                    userId: emp._id,
                    date,
                    status: "absent",
                    checkInTime: null,
                    checkOutTime: null,
                    totalHours: 0,
                    createdAt: new Date(),
                });
                continue;
            }

            // present / late / half-day
            const statusRoll = Math.random();
            let status: "present" | "late" | "half-day" = "present";

            if (statusRoll < 0.15) status = "late";
            else if (statusRoll < 0.25) status = "half-day";

            // Basic timing logic
            let checkInHour = 9;
            let checkInMinute = getRandomInt(0, 20); // 9:00–9:20 for present
            if (status === "late") {
                checkInHour = 10;
                checkInMinute = getRandomInt(0, 30); // 10:00–10:30 for late
            } else if (status === "half-day") {
                checkInHour = 13;
                checkInMinute = getRandomInt(0, 15); // 1PM for half-day
            }

            const checkInTime = new Date(date);
            checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

            let totalHours = 8;
            if (status === "half-day") totalHours = 4;
            if (status === "late") totalHours = 7;

            const checkOutTime = new Date(checkInTime);
            checkOutTime.setHours(checkInTime.getHours() + totalHours);

            attendanceDocs.push({
                userId: emp._id,
                date,
                status,
                checkInTime,
                checkOutTime,
                totalHours,
                createdAt: new Date(),
            });
        }
    }

    if (attendanceDocs.length > 0) {
        const inserted = await Attendance.insertMany(attendanceDocs);
        console.log(`📅 Seeded ${inserted.length} attendance records`);
    } else {
        console.log("⚠️ No attendance docs generated");
    }
}

async function run() {
    await connectDB();
    await clearCollections();

    const employees = await seedEmployees();
    await seedAttendance(employees);

    console.log("✅ Seeding completed");
    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
});
