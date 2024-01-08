import { RequestHandler } from 'express';

import Recipe from '../models/recipeModel.js';
import catchAsync from '../utils/catchAsync.js';
import { RECIPES_PER_PAGE } from '../utils/constants.js';
import paginate from '../utils/paginate.js';
import User from '../models/userModel.js';

const getRecipes: RequestHandler = catchAsync(async (req, res, next) => {
  const { category, page = 1, limit = RECIPES_PER_PAGE } = req.query;

  let query = {};

  if (category) {
    query = { category: { $regex: new RegExp(`^${category}`, 'i') } };
  }

  const paginatedRecipes = await paginate(Recipe.find(query), {
    page,
    limit,
  });

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
  const { id: userId } = req.user as UserDocument;
  const { recipeId } = req.params;
  const { isPrivate } = req.query;

  const recipeSelect =
    '+ingredients +strInstructions +strDescription +cookingTime';

  let recipe;
  if (isPrivate) {
    recipe = await Recipe.findOne({
      owner: userId,
      _id: recipeId,
      visibility: 'private',
    }).select(recipeSelect);
  } else {
    recipe = await Recipe.findById(req.params.recipeId).select(recipeSelect);
  }

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

const getRecipesByQuery: RequestHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
  const { query } = req.params;

  if (!query)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Please provide a query!' });

  const paginatedRecipes = await paginate(
    Recipe.find({ strMeal: new RegExp(`^${query}`, 'i') }),
    { page, limit }
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

    if (!ingredient)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Please provide an ingredient!' });

    // ! Why is this not working? !
    const paginatedRecipes = await paginate(
      Recipe.find({
        'ingredients.ingredient.name': new RegExp(`^${ingredient}`, 'i'),
      }).select('+ingredients'),
      { page, limit }
    );

    return res.status(200).json({
      status: 'success',
      ...paginatedRecipes,
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
  // TODO - add photo upload

  const { id } = req.user as UserDocument;
  const {
    strMeal,
    strMealThumb,
    strInstructions,
    strDescription,
    cookingTime,
    ingredients,
    category,
  } = req.body;

  const newRecipe = await Recipe.create({
    strMeal,
    strMealThumb,
    strInstructions,
    strDescription,
    cookingTime,
    ingredients,
    category,
    owner: id,
  });

  res.status(201).json({ status: 'success', data: newRecipe });
});

const getOwnRecipes: RequestHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
  const { id } = req.user as UserDocument;

  const recipes = await paginate(
    Recipe.find({ owner: id, visibility: 'private' }).select(
      '+cookingTime +strDescription'
    ),
    { page, limit }
  );

  res.status(201).json({ status: 'success', ...recipes });
});

const deleteOwnRecipe: RequestHandler = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user as UserDocument;
  const { recipeId } = req.params;

  await Recipe.findOneAndDelete({
    owner: userId,
    _id: recipeId,
    visibility: 'private',
  });

  res.status(204).json({ status: 'success', data: null });
});

const getFavouriteRecipes: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
    const { id: userId } = req.user as UserDocument;

    const user = await User.findById(userId)
      .select('+favouriteRecipes')
      .populate({
        path: 'favouriteRecipes',
        select: '+cookingTime +strDescription',
      });

    const recipes = user?.favouriteRecipes;
    const paginatedRecipes = await paginate(
      Recipe.find({ _id: { $in: recipes } }).select(
        '+cookingTime +strDescription'
      ),
      { page, limit }
    );

    res.status(200).json({ status: 'success', ...paginatedRecipes });
  }
);

const addFavouriteRecipe: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { recipeId } = req.body;
    const { id: userId } = req.user as UserDocument;

    const user = await User.findById(userId).select('+favouriteRecipes');
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Check if the recipe already exists in favorites
    if (user.favouriteRecipes.includes(recipeId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Recipe already exists in favorites',
      });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipe not found',
      });
    }

    // Add the recipe to favorites if it doesn't exist
    user.favouriteRecipes.push(recipeId);
    await user.save();

    res.status(201).json({ status: 'success', data: recipe });
  }
);

const deleteFavouriteRecipe: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id: userId } = req.user as UserDocument;
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe)
      return res.status(404).json({
        status: 'fail',
        message: 'Recipe not found',
      });

    await User.findByIdAndUpdate(userId, {
      $pull: { favouriteRecipes: recipeId },
    });

    res.status(204).json({ status: 'success', data: null });
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
  addFavouriteRecipe,
  deleteFavouriteRecipe,
};
