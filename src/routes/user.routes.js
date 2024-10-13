import { Router } from "express";
import { forgotPassword, getAllUsers, logoutUser, registerUser, resetPassword, userLogin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(userLogin);
router.route("/reset-password").post(isAuthenticated, resetPassword);
router.route("/forgot-password").post(isAuthenticated, forgotPassword);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/list").get(getAllUsers);
export default router;
