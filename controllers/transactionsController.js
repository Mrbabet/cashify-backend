const {Transaction} = require('../models/transactions')
const {User} = require('../models/user')

const addIncome = async (req, res) => {
    try {
      // Create a new transaction using the data from the request body
      const transaction = await Transaction.create(req.body);
  
      // Find the user by their ID
      const user = await User.findById(req.user._id);
  
      // Extract necessary data from the transaction
      const { userId, operation: operationType, sum: operationSum } = transaction;
  
      // Calculate the new user balance by adding the operation sum to the current balance
      let userBalance = user.balance;
      userBalance += operationSum;
  
      // Update the user's balance in the database
      user.balance = userBalance;
      await user.save();
  
      // Return a response with status 201 (created) along with the new transaction data and the updated user balance
      return res.status(201).json({ data: transaction, user: { balance: user.balance } });
    } catch (error) {
      // If an error occurs, handle it and send a 500 (Internal Server Error) response
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const addExpense =async  function(){
    
}

const getIncome = async function(){
    
}

const getExpense = async function(){
    
}

const deleteTransaction = async function(){

}

const getIncomeCategories = async function(){
    
}
const getTransactionsTimeData = async function(){

}

module.exports={ addIncome }