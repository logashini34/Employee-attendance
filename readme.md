## 👨‍💻 Author  
**Logashini M**
## College 
**SNS COLLEGE OF TECHNOLOGY**

## 📞 Contact  
- **Email:** logasri536@gmail.com  
- **Phone:** +91 9597466944
- **LinkedIn:** www.linkedin.com/in/logashini  
- **GitHub:** https://github.com/logashini34  


# Employee Attendance System
A full-stack attendance tracking application built for organizations to manage daily employee attendance with two user roles — Employee and Manager. Employees can mark their daily check-ins/check-outs, while managers can monitor the attendance of their entire team, generate reports, and view insights through dashboards.

## Tech Stack
- **Frontend:** React (TS)
- **Backend:** Node.js, Express (TS-Node)
- **Database:** MongoDB

## Features

### Employee
- Register/Login
- Daily Check-In / Check-Out
- View Attendance History (Calendar/Table)
- Monthly Summary
- Dashboard with statistics

### Manager
- Login
- View all employees’ attendance
- Filter by employee/date/status
- Team attendance summary
- Export CSV reports
- Manager dashboard with analytics

## Pages

### Employee
- Login/Register
- Dashboard
- Mark Attendance
- My Attendance History
- Profile

### Manager
- Login
- Dashboard
- All Employees Attendance
- Team Calendar View
- Reports

## Database Schema

### Users
- id
- name
- email
- password (hashed)
- role (employee/manager)
- employeeId
- department
- createdAt

### Attendance
- id
- userId
- date
- checkInTime
- checkOutTime
- status (present/absent/late/half-day)
- totalHours
- createdAt

## API Endpoints

### Auth
POST /api/auth/register  
POST /api/auth/login  
GET /api/auth/me  

### Attendance (Employee)
POST /api/attendance/checkin  
POST /api/attendance/checkout  
GET /api/attendance/my-history  
GET /api/attendance/my-summary  
GET /api/attendance/today  

### Attendance (Manager)
GET /api/attendance/all  
GET /api/attendance/employee/:id  
GET /api/attendance/summary  
GET /api/attendance/export  
GET /api/attendance/today-status  

### Dashboard
GET /api/dashboard/employee  
GET /api/dashboard/manager  

## Running the Project

### 1. Clone
git clone https://github.com/logashini34/Employee-attendance

### 2. Backend Setup (Created with Express-Template-CLI)
cd server  
npm install  
npm run dev

### 3. Frontend Setup
cd web-application  
npm install  
npm start

