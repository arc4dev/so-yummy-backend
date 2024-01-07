import { RequestHandler } from 'express';

import Ingredient from '../models/IngredientModel.js';
import catchAsync from '../utils/catchAsync.js';

const getIngredientsByQuery: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { ingredient } = req.params;

    const ingredients = await Ingredient.find({
      name: new RegExp(ingredient, 'i'),
    });

    res.status(200).json({
      status: 'success',
      results: ingredients.length,
      data: ingredients,
    });
  }
);

export default { getIngredientsByQuery };
