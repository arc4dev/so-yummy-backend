import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Recipe from '../models/RecipeModel.js';
import Ingredient from '../models/IngredientModel.js';
import connectDB from '../utils/connectDB.js';
import { RECIPES_DATA2 } from './recipes-update.js';

dotenv.config();

await connectDB();

async function populateDatabase(recipes: any[]) {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    let count = 0;
    try {
      for (const recipe of recipes) {
        const ingredients = recipe.ingredients;
        const ingredientsRefs = [];

        for (const ingredient of ingredients) {
          let ingredientRef;

          const existingIngredient = await Ingredient.findOne({
            name: ingredient.ingredientName,
          }).session(session);

          if (existingIngredient) {
            ingredientRef = existingIngredient._id;
          } else {
            const newIngredient = await Ingredient.create(
              [
                {
                  name: ingredient.ingredientName,
                  image: `www.themealdb.com/images/ingredients/${ingredient.ingredientName}.png`,
                },
              ],
              { session: session }
            );

            ingredientRef = newIngredient[0]._id;
          }

          ingredientsRefs.push({
            ingredient: ingredientRef,
            ingredientMeasure: ingredient.ingredientMeasure,
          });
        }

        await Recipe.create(
          [
            {
              strMeal: recipe.strMeal,
              strMealThumb: recipe.strMealThumb,
              strInstructions: recipe.strInstructions,
              ingredients: ingredientsRefs,
              category: recipe.category,
            },
          ],
          { session: session }
        );

        count += 1;

        console.log(`Recipe ${count} of ${recipes.length} populated!`);
      }

      await session.commitTransaction();
      session.endSession();
      console.log('Recipes and ingredients populated successfully!');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error while populating database:', error);
    }
  } catch (error) {
    console.error('Error starting a transaction:', error);
  }
}

const [part1, part2, part3, part4, part5] = [
  RECIPES_DATA2.slice(0, 60),
  RECIPES_DATA2.slice(60, 120),
  RECIPES_DATA2.slice(120, 180),
  RECIPES_DATA2.slice(180, 240),
  RECIPES_DATA2.slice(240),
];

await populateDatabase(part1);
await populateDatabase(part2);
await populateDatabase(part3);
await populateDatabase(part4);
await populateDatabase(part5);
