import jwt from "jsonwebtoken";
import { UserModal } from "../models/User.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      return res.status(401).json({
        message: "UnAuthorized Access",
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await UserModal.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(401).json({
        message: "Invalid Access Token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Middleware :", error);
  }
};

export { isAuthenticated };
