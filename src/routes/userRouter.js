import { Router } from "express";
import userController from "../controllers/userController";
import middlewares from "../middlewares";

const router = Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put(
  "/change-password",
  middlewares.verifyAccessToken,
  userController.changePassword
);
router.put(
  "/change-infor",
  middlewares.verifyAccessToken,
  userController.changeInfor
);
router.get(
  "/get-user-details",
  middlewares.verifyAccessToken,
  userController.getUserDetails
);
router.post("/forget-password", userController.forgetPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/get-access-token", userController.getAccessToken);

export default router;
