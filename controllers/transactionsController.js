const { trace } = require("joi");
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
  const user = await Transaction.findById({ _id, userId });
  if (!user || user.length < 1) return false;

  const deleteTransaction = Transaction.findByIdAndDelete(_id);

  if (deleteTransaction) {
    const balance = req.user.balance;
    const newBalance =
      balance +
      deleteTransaction.amount *
        (deleteTransaction.transactionType === "expense" ? 1 : -1);

    await User.findByIdAndUpdate(req.user._id, { balance: newBalance });

    return res.status(200).json({
      status: "success",
      code: 200,
      data: { deleteTransaction },
      message: "Object deleted",
    });
  }
  return res.json({ status: "error", code: 404, message: "Not found" });
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
