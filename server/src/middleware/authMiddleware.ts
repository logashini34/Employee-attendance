import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthUser } from "../utils/types/authTypes";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader === "string") {
        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ error: "No token found" })
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return res.status(401).json({ error: err.message });
            }

            console.log(user);
            req.user = user as AuthUser;
            next();
        });
    } else {
        res.status(401).json({ error: "Not an authorized user" });
    }
};

export const authenticateManager = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader === "string") {
        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ error: "No token found" })
            return;
        }

        jwt.verify(token, process.env.JWT_MANAGER_SECRET as string, (err, user) => {
            if (err) {
                return res.status(401).json({ error: err.message });
            }

            console.log(user);
            req.user = user as AuthUser;
            next();
        });
    } else {
        res.status(401).json({ error: "Not an authorized user" });
    }
};

export default authenticateJWT;
