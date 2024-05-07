const { User } = require("../models/user");
const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    if (!verificationToken)
      return res.status(404).json({ message: "User not found..." });

    const user = await User.findOne({ verificationToken });

    if (user) {
      user.verificationToken = null;
      user.verify = true;

      await user.save();
      res.status(200).json({
        user: {
          email: user.email,
          verificationToken: user.verificationToken,
          verify: user.verify,
        },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { verifyEmail };
