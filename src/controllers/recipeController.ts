import { RequestHandler } from 'express';
import Recipe from '../models/recipeModel.js';
import catchAsync from '../utils/catchAsync.js';

const addNewRecipe: RequestHandler = catchAsync(async (req, res, next) => {
  const {} = req.body;

  const newRecipe = await Recipe.create({});

  res.status(201).json({ status: 'success', data: newRecipe });
});

const deleteRecipe: RequestHandler = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);

  if (!recipe)
    return res.status(404).json({
      status: 'fail',
      message: 'Recipe not found',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getRecipeById: RequestHandler = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.recipeId);

  if (!recipe)
    return res.status(404).json({
      status: 'fail',
      message: 'Recipe not found',
    });

  res.status(200).json({
    status: 'success',
    data: recipe,
  });
});

// re think updating a recipe

const getAllRecipeCategories: RequestHandler = catchAsync(
  async (req, res, next) => {
    const categories = ['yey'];

    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  }
);

export default {
  addNewRecipe,
  getRecipeById,
  deleteRecipe,
  getAllRecipeCategories,
};

// getByCategory
// getByQuery
// getByIngredient

// addOwnRecipe
