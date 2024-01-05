import mongoose from 'mongoose';

import Ingredient from './IngredientModel.js';
import { RECIPE_CATEGORIES } from '../utils/constants.js';

interface RecipeModel extends mongoose.Model<RecipeDocument> {
  findOwnRecipes(userId: mongoose.Types.ObjectId): Promise<RecipeDocument[]>;
  findOwnRecipe(
    userId: mongoose.Types.ObjectId,
    recipeId: string
  ): Promise<RecipeDocument>;
}

const recipeSchema = new mongoose.Schema<RecipeDocument>(
  {
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
    strDescription: {
      type: String,
      required: [true, "The 'strDescription' field is required."],
      select: false,
    },
    cookingTime: {
      type: Number,
      required: [true, "The 'cookingTime' field is required."],
      min: [1, 'The cooking time must be at least 1 minute.'],
      max: [300, 'The cooking time cannot be longer than 5 hours.'],
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
            // enum: {
            //   values: ['tbs', 'tsp', 'kg', 'g', 'ml'],
            //   message: `The 'ingredientMeasure' field must be one of the following values: tbs, tsp, ml kg or g.`,
            // },
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
      default: 'private',
      select: false,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      validate: {
        validator: function (
          this: RecipeDocument,
          v: mongoose.Schema.Types.ObjectId | undefined
        ): boolean {
          return this.visibility === 'private' ? !!v : true;
        },
        message: () =>
          `The 'user' field is required when visibility is private.`,
      },
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Find only public recipes by default
recipeSchema.pre<mongoose.Query<any, any>>(/^find/, function (next) {
  // Check if the query is for private recipes
  if (this.getFilter().visibility === 'private') {
    return next();
  }

  this.find({ visibility: 'public' });

  next();
});

// Populate ingredient objects before find
recipeSchema.pre<mongoose.Query<any, any>>(/^find/, function (next) {
  this.populate('ingredients.ingredient', 'name image -_id', Ingredient).select(
    '-__v -createdAt -updatedAt'
  );

  next();
});

recipeSchema.statics.findOwnRecipes = async function (userId) {
  return this.find({ owner: userId, visibility: 'private' });
};

recipeSchema.statics.findOwnRecipe = async function (userId, recipeId) {
  return this.findOne({
    owner: userId,
    _id: recipeId,
    visibility: 'private',
  })
    .select('+ingredients +strInstructions +strDescription +cookingTime')
    .populate('ingredients.ingredient', 'name image -_id', Ingredient);
};

const Recipe = mongoose.model<RecipeDocument, RecipeModel>(
  'Recipe',
  recipeSchema
);

export default Recipe;
