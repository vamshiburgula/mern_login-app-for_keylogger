import userModel from "../models/userModel.js";

export const getUserdata = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      userData: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        keyloggerInstalled: user.keyloggerInstalled,
        lastKeyloggerActivity: user.lastKeyloggerActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateKeyloggerStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        keyloggerInstalled: true,
        lastKeyloggerActivity: Date.now(),
      },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getKeyloggerStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    res.json({
      success: true,
      keyloggerInstalled: user.keyloggerInstalled,
      lastActivity: user.lastKeyloggerActivity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
