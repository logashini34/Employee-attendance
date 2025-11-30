import express from "express";
import { loginUser, registerUser, currentUser, refreshToken } from "../controllers/UserController";
import ensureAuthenticated from "../middleware/authMiddleware";

const router = express.Router();

router.route("/me").get(ensureAuthenticated, currentUser);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/refresh_token").post(refreshToken);

export default router;
