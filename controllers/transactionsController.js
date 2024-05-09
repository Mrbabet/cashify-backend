const { Transaction } = require("../models/transactions");
const { User } = require("../models/user");

const addIncome = async (req, res, next) => {
  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user._id,
  });

  const user = await User.findById(req.user._id);
  const oldBalance = user.balance;

  const newBalance = oldBalance + req.body.amount;

  await User.findByIdAndUpdate(req.user._id, { balance: newBalance });

  return res.status(201).json({
    status: "success",
    code: 201,
    data: { transaction },
  });
};
const addExpense = async (req, res, next) => {
  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user._id,
  });

  const user = await User.findById(req.user._id);
  const oldBalance = user.balance;

  const newBalance = oldBalance - req.body.amount;

  await User.findByIdAndUpdate(req.user._id, { balance: newBalance });

  return res.status(201).json({
    status: "success",
    code: 201,
    data: { transaction },
  });
};

const getIncome = async function () {};

const getExpense = async function () {};

const deleteTransaction = async function () {};

const getIncomeCategories = async function () {};
const getTransactionsTimeData = async function () {};

module.exports = { addIncome, addExpense };
