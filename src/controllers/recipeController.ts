import { RequestHandler } from 'express';

import Recipe from '../models/recipeModel.js';
import catchAsync from '../utils/catchAsync.js';
import { RECIPES_PER_PAGE } from '../utils/constants.js';
import paginate from '../utils/paginate.js';

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

const getRecipes: RequestHandler = catchAsync(async (req, res, next) => {
  const { category, page = 1, limit = RECIPES_PER_PAGE } = req.query;
  const pageCurrent = parseInt(page as string);
  const pageLimit = parseInt(limit as string);

  let query = {};

  if (category) {
    query = { category: { $regex: new RegExp(`^${category}`, 'i') } };
  }

  const paginatedRecipes = await paginate(
    Recipe,
    query,
    pageCurrent,
    pageLimit
  );

  if (!paginatedRecipes)
    return res.status(404).json({
      status: 'fail',
      message: 'Recipes not found',
    });

  res.status(200).json({
    status: 'success',
    ...paginatedRecipes,
  });
});

const getRecipeById: RequestHandler = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.recipeId).select(
    '+ingredients +strInstructions'
  );

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

const getRecipesByQuery: RequestHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
  const { query } = req.params;

  const pageCurrent = parseInt(page as string);
  const pageLimit = parseInt(limit as string);

  if (!query)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Please provide a query!' });

  const regex = new RegExp(`^${query}`, 'i');
  const paginatedRecipes = await paginate(
    Recipe,
    { strMeal: regex },
    pageCurrent,
    pageLimit
  );

  return res.status(200).json({
    status: 'success',
    ...paginatedRecipes,
  });
});

const getRecipesByIngredient: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
    const { ingredient } = req.params;

    const pageCurrent = parseInt(page as string);
    const pageLimit = parseInt(limit as string);

    if (!ingredient)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Please provide an ingredient!' });

    const regex = new RegExp(`^${ingredient}`, 'i');
    // ! Why is this not working? !
    const recipes = await Recipe.find({
      'ingredients.ingredient.name': regex,
    }).select('+ingredients');

    return res.status(200).json({
      status: 'success',
      results: recipes.length,
      data: recipes,
    });
  }
);

const getAllRecipeCategories: RequestHandler = catchAsync(
  async (req, res, next) => {
    const categories = await Recipe.distinct('category');

    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  }
);

const addOwnRecipe: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;
  const {} = req.body;

  const newRecipe = await Recipe.create({});

  res.status(201).json({ status: 'success', data: newRecipe });
});

const deleteOwnRecipe: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic
  const {} = req.body;

  await Recipe.findByIdAndDelete({});

  res.status(201).json({ status: 'success' });
});

const getOwnRecipes: RequestHandler = catchAsync(async (req, res, next) => {
  // TODO - Logic

  const recipes = await Recipe.find({});

  res.status(201).json({ status: 'success', data: recipes });
});

const getFavouriteRecipes: RequestHandler = catchAsync(
  async (req, res, next) => {
    // TODO - Logic

    const recipes = await Recipe.find({});

    res.status(201).json({ status: 'success', data: recipes });
  }
);

export default {
  getRecipeById,
  getRecipesByQuery,
  getRecipesByIngredient,
  getRecipes,
  deleteRecipe,
  getAllRecipeCategories,
  addOwnRecipe,
  deleteOwnRecipe,
  getOwnRecipes,
  getFavouriteRecipes,
};
