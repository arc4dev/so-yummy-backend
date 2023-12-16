const Transaction = require('../models/transactionModel');

const createNewTransaction = async (req, res, next) => {
  try {
    const { sum, date, category, comment } = req.body;

    const newTransaction = await Transaction.create({
      sum,
      date,
      category,
      comment,
      owner: req.user._id,
    });

    res.status(201).json({ status: 'success', data: newTransaction });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTransaction)
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });

    res.status(201).json({
      status: 'success',
      data: updatedTransaction,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const removeTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.transactionId);

    if (!transaction)
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const getTransactionCategories = async (req, res, next) => {
  try {
    const categories = await Transaction.distinct('category');

    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

module.exports = {
  createNewTransaction,
  getAllTransactions,
  updateTransaction,
  removeTransaction,
  getTransactionCategories,
};
