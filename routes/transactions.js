const express = require("express");

const auth = require("../middlewares/auth");
const router = express.Router();

router.post("transaction/income", auth);
router.get("transaction/income", auth);
router.post("transaction/expense", auth);
router.get("transaction/expense", auth);
router.delete("transaction", auth);
router.get("transaction/income-categories", auth);
router.get("transaction/expense-categories", auth);
router.get("transaction/period-data", auth);

module.exports = router;
