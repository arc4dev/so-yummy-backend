import mongoose from 'mongoose';

import { RECIPE_CATEGORIES } from '../utils/constants.js';

const recipeSchema = new mongoose.Schema({
  strMeal: {
    type: String,
    required: [true, "The 'strMeal' field is required."],
  },
  strMealThumb: {
    type: String,
    required: [true, "The 'strMealThumb' field is required."],
  },
  strInstructions: {
    type: String,
    required: [true, "The 'strInstructions' field is required."],
    select: false,
  },
  ingredients: {
    type: [
      {
        _id: false,
        ingredientName: {
          type: String,
          required: [
            true,
            "The 'ingredientName' field in 'ingredients' is required.",
          ],
        },
        ingredientMeasure: {
          type: String,
          required: [
            true,
            "The 'ingredientMeasure' field in 'ingredients' is required.",
          ],
        },
      },
    ],
    select: false,
  },
  category: {
    type: String,
    enum: {
      values: RECIPE_CATEGORIES,
      message: `The 'category' field must be one of the following values: ${RECIPE_CATEGORIES.join(
        ', '
      )}.`,
    },
    select: false,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
