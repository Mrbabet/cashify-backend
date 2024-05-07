const { sendVerification } = require("./sendVerificationEmail");
const { User } = require("../models/user");
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Error 401" });
  }

  if (user.verify) {
    return res
      .status(200)
      .json({ message: "Verification has already been passed" });
  }

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href="${process.env.CLIENT_URL}/api/users/verify/${user.verificationToken}">Click verify email<a>`,
  };
  sendVerification(user);
  res.json({
    status: "success",
    code: 200,
    email,
    message: "Verification email sent",
  });
};

module.exports = { resendVerifyEmail };
