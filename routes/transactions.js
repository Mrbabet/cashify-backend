const express = require("express");
const ctrlTransactions = require("../controllers/transactionsController");
const auth = require("../middlewares/auth");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const { transactionSchema } = require("../validation/transactionSchema");
const validation = require("../middlewares/validation");

const router = express.Router();

router.post(
  "/income",
  auth,
  validation(transactionSchema),
  ctrlWrapper(ctrlTransactions.addIncome)
);
router.get("/income", auth, ctrlWrapper(ctrlTransactions.getIncome));
router.post(
  "/expense",
  auth,
  validation(transactionSchema),
  ctrlWrapper(ctrlTransactions.addExpense)
);
router.get("/expense", auth, ctrlWrapper(ctrlTransactions.getExpense));
router.delete("transaction", auth);
router.get("transaction/income-categories", auth);
router.get("transaction/expense-categories", auth);
router.get("transaction/period-data", auth);

module.exports = router;
