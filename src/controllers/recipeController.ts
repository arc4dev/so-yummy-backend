import { RequestHandler } from 'express';
import Recipe from '../models/recipeModel.js';

const addNewRecipe: RequestHandler = async (req, res, next) => {
  try {
    const {} = req.body;

    const newRecipe = await Recipe.create({});

    res.status(201).json({ status: 'success', data: newRecipe });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const deleteRecipe: RequestHandler = async (req, res, next) => {
  try {
    const transaction = await Recipe.findByIdAndDelete(req.params.recipeId);

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

// re think updating a recipe

const getAllRecipeCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await Recipe.distinct('category');

    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export default {
  addNewRecipe,
  deleteRecipe,
  getAllRecipeCategories,
};
