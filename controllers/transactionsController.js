const { Transaction } = require("../models/transactions");
const { User } = require("../models/user");

const addIncome = async (req, res, next) => {
  const transactionType = req.body.transactionType || "income";

  if (transactionType !== "income")
    return res.status(403).json({ message: "wrong transaction type" });

  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user._id,
    transactionType: transactionType,
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
  const transactionType = req.body.transactionType || "expense";
  if (transactionType !== "expense")
    return res.status(403).json({ message: "wrong transaction type" });

  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user._id,
    transactionType: transactionType,
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

const getExpense = async (req, res, next) => {
  const userId = req.user._id;
  const transactionExpense = await Transaction.find(
    { userId: userId, transactionType: "expense" },
    "_id date description amount category transactionType userId"
  );

  return res.status(201).json({
    status: "success",
    code: 201,
    data: { userId, transactionExpense },
  });
};

const getIncome = async (req, res, next) => {
  const userId = req.user._id;
  const transactionIncome = await Transaction.find(
    { userId: userId, transactionType: "income" },
    "_id date description amount category transactionType userId"
  );

  return res.status(201).json({
    status: "success",
    code: 201,
    data: { userId, transactionIncome },
  });
};

const deleteTransaction = async function (req, res) {
  const transactionId = req.params.transactionId;
  const userId = req.user._id;

  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Transaction not found",
    });
  }
  const userIdString = userId.toString();
  const transactionUserIdString = transaction.userId.toString();

  if (userIdString !== transactionUserIdString) {
    return res.status(403).json({
      status: "error",
      code: 403,
      message: "Unauthorized",
    });
  }

  await Transaction.findByIdAndDelete(transactionId);

  const balanceChange = transaction.transactionType === "expense" ? 1 : -1;
  const newBalance = req.user.balance + transaction.amount * balanceChange;
  await User.findByIdAndUpdate(req.user._id, { balance: newBalance });

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Transaction deleted successfully",
  });
};

const getIncomeCategories = async function () {};
const getTransactionsTimeData = async function () {};

module.exports = {
  addIncome,
  addExpense,
  getIncome,
  getExpense,
  deleteTransaction,
};
