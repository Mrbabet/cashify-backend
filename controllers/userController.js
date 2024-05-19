const { User } = require("../models/user");

const getCurrent = async (req, res) => {
  const { email, balance, _id: id } = req.user;

  res.status(200).json({
    email,
    balance,
    id,
  });
};
const updateUserBalance = async (req, res) => {
  const userId = req.user._id;
  const { balance } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.balance = balance;

  await user.save();

  return res.status(200).send({ balance });
};

module.exports = { getCurrent, updateUserBalance };
