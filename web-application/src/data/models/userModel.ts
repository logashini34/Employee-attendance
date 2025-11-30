export interface User {
    name: string;
    email: string;
    password: string;
    role: "EMPLOYEE" | "MANAGER";
    employeeId: string;
    department?: string;
    createdAt: Date;
}