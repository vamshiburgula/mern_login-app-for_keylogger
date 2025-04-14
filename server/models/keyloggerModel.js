import mongoose from "mongoose";

const keyloggerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    keystrokes: { type: String, required: true },
    windowTitle: { type: String, required: true },
    isTrustedSite: { type: Boolean, default: false },
    isUnsafeSite: { type: Boolean, default: false },
    flags: { type: [String], default: [] },
    anomalies: { type: [String], default: [] },
    encrypted: { type: Boolean, default: true },
    systemInfo: { type: Object, default: {} }, // ✅ keep this for Python integration
  },
  {
    timestamps: true,
  }
);

const KeyloggerModel =
  mongoose.models.keylogger || mongoose.model("keylogger", keyloggerSchema);
export default KeyloggerModel;
