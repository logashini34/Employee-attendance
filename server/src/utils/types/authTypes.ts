export interface AuthUser {
    email: string;
    role?: "EMPLOYEE" | "MANAGER";
    _id: string;
}