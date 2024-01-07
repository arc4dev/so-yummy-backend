import { RequestHandler } from 'express';

import catchAsync from '../utils/catchAsync.js';

const getIngredients: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic

  res.status(201).json({ status: 'success' });
});

const addIngredient: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic

  res.status(201).json({ status: 'success' });
});

const removeIngredient: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic

  res.status(201).json({ status: 'success' });
});

export default { getIngredients, addIngredient, removeIngredient };
