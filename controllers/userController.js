const { User } = require("../models/user");

const getCurrent = async (req, res) => {
  const { email } = req.user;

  res.status(200).json({
    email,
  });
};
const updateUserBalance = async (req, res) => {
  const userId = req.user._id;
  const { newBalance } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.balance = newBalance;

  await user.save();

  return res.status(200).send({ newBalance });
};

module.exports = { getCurrent, updateUserBalance };
