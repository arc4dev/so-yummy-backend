const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sum: {
    type: Number,
    required: [true, 'Sum is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'A transaction must have an owner'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  category: {
    type: String,
    enum: {
      values: [
        'main expenses',
        'self care',
        'products',
        'child care',
        'household products',
        'education',
        'leisure',
        'income',
        'other expenses',
        'entertainment',
        'car',
      ],
      message:
        'Category must be only these: [main expenses, self care, products, child care, household products, education, leisure, income, other expenses, entertainment or car]',
    },
  },
  comment: String,
  type: String,
});

transactionSchema.pre('save', function (next) {
  this.type = this.sum >= 0 ? '+' : '-';

  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
