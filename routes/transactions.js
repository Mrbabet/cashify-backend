const express = require("express");
const ctrlTransactions = require("../controllers/transactionsController");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const { transactionSchema } = require("../validation/transactionSchema");
const validation = require("../middlewares/validation");

const router = express.Router();

router.post(
  "/income",
  validation(transactionSchema),
  ctrlWrapper(ctrlTransactions.addIncome)
);
router.get("/income", ctrlWrapper(ctrlTransactions.getIncome));
router.post(
  "/expense",
  validation(transactionSchema),
  ctrlWrapper(ctrlTransactions.addExpense)
);
router.get("/expense", ctrlWrapper(ctrlTransactions.getExpense));
router.delete(
  "/:transactionId",

  ctrlWrapper(ctrlTransactions.deleteTransaction)
);
router.get(
  "/income-categories",

  ctrlWrapper(ctrlTransactions.getIncomeCategories)
);
router.get(
  "/expense-categories",

  ctrlWrapper(ctrlTransactions.getExpenseCategories)
);
router.get("/period-data");

module.exports = router;
