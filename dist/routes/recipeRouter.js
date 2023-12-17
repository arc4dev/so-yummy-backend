import express from 'express';
import recipeController from '../controllers/recipeController.js';
import authController from '../controllers/authController.js';
const recipeRouter = express.Router();
// Auth before all requests
recipeRouter.use(authController.auth);
recipeRouter.route('/').post(recipeController.addNewRecipe);
recipeRouter.route('/:recipeId').delete(recipeController.deleteRecipe);
recipeRouter.get('/categories', recipeController.getAllRecipeCategories);
export default recipeRouter;
