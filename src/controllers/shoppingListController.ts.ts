import { RequestHandler } from 'express';

import catchAsync from '../utils/catchAsync.js';

const addIngredientToShoppingList: RequestHandler = catchAsync(
  async (req, res, next) => {
    // TODO - Logic

    res.status(201).json({ status: 'success' });
  }
);

const removeIngredientFromShoppingList: RequestHandler = catchAsync(
  async (req, res, next) => {
    // TODO - Logic

    res.status(201).json({ status: 'success' });
  }
);
