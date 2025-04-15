import mongoose from "mongoose";

const decryptedKeyloggerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  keystrokes: { type: String, required: true },
  windowTitle: { type: String, required: true },
  systemInfo: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const DecryptedKeyloggerModel =
  mongoose.models.decryptedKeylogger ||
  mongoose.model("decryptedKeylogger", decryptedKeyloggerSchema);

export default DecryptedKeyloggerModel;
