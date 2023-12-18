import express from 'express';
import recipeController from '../controllers/recipeController.js';
import authController from '../controllers/authController.js';

const recipeRouter = express.Router();

// Auth before all requests
recipeRouter.use(authController.auth);

recipeRouter
  .route('/')
  .get(recipeController.getRecipes)
  .post(recipeController.addNewRecipe);

recipeRouter.get('/search/:query', recipeController.getRecipesByQuery);

recipeRouter.get(
  '/ingredient/:ingredient',
  recipeController.getRecipesByIngredient
);

recipeRouter.get('/categories', recipeController.getAllRecipeCategories);

recipeRouter
  .route('/:recipeId')
  .delete(recipeController.deleteRecipe)
  .get(recipeController.getRecipeById);

export default recipeRouter;
