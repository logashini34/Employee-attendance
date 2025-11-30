// src/controllers/userController.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/UserModel";
import { ApiMessages } from "../utils/types/apiMessages";
import { ApiError } from "../utils/types/errors";
import { AuthUser } from "../utils/types/authTypes";


const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH as string;

const MANAGER_ACCESS_TOKEN_SECRET = process.env.JWT_MANAGER_SECRET as string;
const MANAGER_REFRESH_TOKEN_SECRET = process.env.JWT_MANAGER_REFRESH as string;

// helper functions
function createAccessToken(payload: { _id: string; email: string, role?: "EMPLOYEE" | "MANAGER" }, isManager = false) {
  return jwt.sign({ ...payload, role: payload.role ?? "EMPLOYEE" }, isManager ? MANAGER_ACCESS_TOKEN_SECRET : ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

function createRefreshToken(payload: { _id: string; email: string, role?: "EMPLOYEE" | "MANAGER" }, isManager = false) {
  return jwt.sign({ ...payload, role: payload.role ?? "EMPLOYEE" }, isManager ? MANAGER_REFRESH_TOKEN_SECRET : REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// @desc    Register an employee user
// @route   POST /users/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, department, employeeId, role } = req.body as Partial<IUser>;

  // No manager registration here
  if (role === "MANAGER") {
    throw new ApiError(ApiMessages.MANAGER_REGISTRATION_FORBIDDEN);
  }

  if (!name || !email || !password || !employeeId) {
    throw new ApiError(ApiMessages.REQUIRED_FIELDS);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(ApiMessages.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "EMPLOYEE",
    department: department || "",
    employeeId,
  });

  if (!user) {
    throw new ApiError(ApiMessages.INTERNAL_SERVER_ERROR);
  }

  const _id = user._id.toString();

  const accessToken = createAccessToken(
    { _id, email: user.email },
  );

  const refreshToken = createRefreshToken(
    { _id, email: user.email }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    accessToken,
  });
});

// @desc    Login user (employee or manager)
// @route   POST /auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw new ApiError(ApiMessages.LOGIN_FIELDS);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(ApiMessages.USER_NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(ApiMessages.INVALID_CREDENTIALS);
  }

  const _id = user._id.toString();

  const accessToken = createAccessToken(
    { _id, email: user.email }, user.role === "MANAGER"
  );

  const refreshToken = createRefreshToken(
    { _id, email: user.email }, user.role === "MANAGER"
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    accessToken,
    manager: user.role === "MANAGER"
  });
});

// @desc    Current user info
// @route   GET /auth/current
// @access  Private
export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ApiMessages.UNAUTHORIZED);
  }

  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(ApiMessages.CURRENT_USER_NOT_FOUND);
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

// @desc    Current user info
// @route   POST /auth/current
// @access  Private
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: "No refresh token found" });
    }

    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err || !decoded || typeof decoded === "string") {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      const { _id, email } = decoded as AuthUser;

      const user = await User.findById(_id);
      if (!user) {
        return res.status(401).json({ error: "User no longer exists" });
      }

      const newAccessToken = createAccessToken({ _id, email });
      const newRefreshToken = createRefreshToken({ _id, email });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh_token/", // only sent to this path
      });

      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ error: "Something went wrong, please try again." });
  }
};
