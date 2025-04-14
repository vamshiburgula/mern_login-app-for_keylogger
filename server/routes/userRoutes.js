import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getKeyloggerStatus,
  getUserdata,
} from "../controllers/userController.js";
import { updateKeyloggerStatus } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserdata);
userRouter.post("/keylogger-status", userAuth, updateKeyloggerStatus);
userRouter.get("/keylogger-status", userAuth, getKeyloggerStatus);

export default userRouter;
