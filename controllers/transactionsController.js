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
  try {
    const userId = req.user._id;
    const transactionExpense = await Transaction.find(
      { userId: userId, transactionType: "expense" },
      "_id date description amount category transactionType userId"
    );

    const expenseArray = transactionExpense.map((transaction) => ({
      transactionId: transaction._id,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
    }));

    // Calculate monthly expenses
    const monthStats = calculateMonthlyExpenses(transactionExpense);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: { userId, expenses: expenseArray, monthStats },
    });
  } catch (error) {
    next(error);
  }
};

const getIncome = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactionIncome = await Transaction.find(
      { userId: userId, transactionType: "income" },
      "_id date description amount category transactionType userId"
    );

    const incomeArray = transactionIncome.map((transaction) => ({
      transactionId: transaction._id,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
    }));

    const monthStats = calculateMonthlyExpenses(transactionIncome);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: { userId, income: incomeArray, monthStats },
    });
  } catch (error) {
    next(error);
  }
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

const getIncomeCategories = async function (req, res) {
  const categories = [
    "products",
    "alcohol",
    "entertainment",
    "health",
    "transport",
    "housing",
    "technique",
    "communal communication",
    "sport, hobbies",
    "education",
    "other",
    "salary",
    "additional income",
  ];

  const incomeCategories = categories.filter(
    (category) => category === "salary" || category === "additional income"
  );

  res.status(200).send(incomeCategories);
  return incomeCategories;
};
const getExpenseCategories = async function (req, res) {
  const categories = [
    "products",
    "alcohol",
    "entertainment",
    "health",
    "transport",
    "housing",
    "technique",
    "communal communication",
    "sport, hobbies",
    "education",
    "other",
  ];

  const incomeCategories = categories.filter(
    (category) => category !== "salary" || category !== "additional income"
  );

  res.status(200).send(incomeCategories);
  return incomeCategories;
};
const getTransactionsTimeData = async function () {};

const calculateMonthlyExpenses = (transactions) => {
  const monthStats = {
    January: "N/A",
    February: "N/A",
    March: "N/A",
    April: "N/A",
    May: "N/A",
    June: "N/A",
    July: "N/A",
    August: "N/A",
    September: "N/A",
    October: "N/A",
    November: "N/A",
    December: "N/A",
  };

  transactions.forEach((transaction) => {
    // Ensure transaction.date is parsed into a Date object
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const monthName = getMonthName(month);
    if (monthStats[monthName] === "N/A") {
      monthStats[monthName] = 0;
    }
    monthStats[monthName] += transaction.amount;
  });

  return monthStats;
};

const getMonthName = (monthIndex) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthIndex];
};

module.exports = {
  addIncome,
  addExpense,
  getIncome,
  getExpense,
  deleteTransaction,
  getIncomeCategories,
  getExpenseCategories,
  getTransactionsTimeData,
};
