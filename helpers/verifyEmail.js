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

      // Redirect to a confirmation page after successful verification
      return res.redirect(
        "https://cashify-fullstack-project.vercel.app/welcome"
      );
    } else {
      return res.status(404).json({ message: "User not found..." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyEmail };
