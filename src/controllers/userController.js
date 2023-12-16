const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

const getCurrentUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    // 1. Find a user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // 2. Send a response
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const getUserTransactions = async (req, res, next) => {
  try {
    // Pobierz transakcje użytkownika na podstawie ID użytkownika
    const userTransactions = await Transaction.find({ owner: req.user._id });

    const balance = userTransactions.reduce((acc, curr) => acc + curr.sum, 0);

    res.status(200).json({
      status: 'success',
      balance,
      data: userTransactions,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getUserMonthlyStats = async (req, res, next) => {
  try {
    const userId = req.user._id; // Zakładam, że masz dostęp do zalogowanego użytkownika z uwierzytelnienia
    const { year, month } = req.query;

    const userMonthlyStats = await Transaction.aggregate([
      {
        $match: {
          owner: userId,
          $and: [
            { $expr: { $eq: [{ $year: '$date' }, parseInt(year)] } },
            { $expr: { $eq: [{ $month: '$date' }, parseInt(month)] } },
          ],
        },
      },
      {
        $group: {
          _id: '$category',
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$sum', { $abs: '$sum' }] }, '$sum', 0] },
          },
          totalExpense: { $sum: { $cond: [{ $lt: ['$sum', 0] }, '$sum', 0] } },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: userMonthlyStats,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user monthly stats.',
    });
  }
};

const getUserYearlyStats = async (req, res, next) => {
  try {
    const userId = req.user._id; // Zakładam, że masz dostęp do zalogowanego użytkownika z uwierzytelnienia
    const year = req.query.year;

    const userYearlyStats = await Transaction.aggregate([
      {
        $match: {
          owner: userId,
          $expr: {
            $eq: [{ $year: '$date' }, parseInt(year)],
          },
        },
      },
      {
        $group: {
          _id: '$category', // Grupowanie transakcji według kategorii
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$sum', { $abs: '$sum' }] }, '$sum', 0] },
          },
          totalExpense: { $sum: { $cond: [{ $lt: ['$sum', 0] }, '$sum', 0] } },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: userYearlyStats,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user yearly stats.',
    });
  }
};
module.exports = {
  getCurrentUser,
  getUserTransactions,
  getUserMonthlyStats,
  getUserYearlyStats,
};
