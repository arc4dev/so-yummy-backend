import { RequestHandler } from 'express';

import catchAsync from '../utils/catchAsync.js';

const getIngredients: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic

  res.status(200).json({ status: 'success' });
});

const addIngredient: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logicg

  res.status(201).json({ status: 'success' });
});

const removeIngredient: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic

  res.status(204).json({ status: 'success' });
});

export default { getIngredients, addIngredient, removeIngredient };
