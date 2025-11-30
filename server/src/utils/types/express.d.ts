import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        role?: "EMPLOYEE" | "MANAGER";
        _id: string;
      };
    }
  }
}

export {};
