import mongoose, { Mongoose } from 'mongoose';

import Ingredient from './IngredientModel.js';
import { RECIPE_CATEGORIES } from '../utils/constants.js';

const recipeSchema = new mongoose.Schema<RecipeDocument>({
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
        ingredient: {
          type: mongoose.Schema.ObjectId,
          ref: 'Ingredient',
        },
        ingredientMeasure: {
          type: String,
        },
        _id: false,
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
  visibility: {
    type: String,
    enum: {
      values: ['public', 'private'],
      message: `The 'visibility' field must be one of the following values: public or private.`,
    },
    default: 'public',
    select: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    validate: {
      validator: function (
        this: RecipeDocument,
        v: mongoose.Schema.Types.ObjectId | null | undefined
      ): boolean {
        return this.visibility === 'private' ? !!v : true;
      },
      message: () => `The 'user' field is required when visibility is private.`,
    },
    select: false,
  },
});

// Populate ingredients before specific find
recipeSchema.pre('findOne', function (next) {
  this.populate('ingredients.ingredient', 'name image', Ingredient);

  next();
});

const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema);

export default Recipe;
