const { Schema, model } = require("mongoose");

const transactionSchema = Schema({
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Describe expense"],
  },
  amount: {
    type: Number,
    required: [true, "Insert the amount"],
    min: 0,
  },
  category: {
    type: String,
    required: [true, "Choose category"],
    enum: [],
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Transaction = model("transaction", transactionSchema);

module.exports = {
  Transaction,
};
