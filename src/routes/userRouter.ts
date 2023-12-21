import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import recipeController from '../controllers/recipeController.js';

const userRouter = express.Router();

// Auth before all requests
userRouter.use(authController.auth);

userRouter.get('/me', userController.getCurrentUser);

userRouter
  .route('/my-recipes')
  .get(recipeController.getOwnRecipes)
  .post(recipeController.addOwnRecipe);

userRouter
  .route('/my-recipes/:id')
  .get(recipeController.getOwnRecipes)
  .delete(recipeController.deleteOwnRecipe);

userRouter.get('/favourite-recipes', recipeController.getFavouriteRecipes);

export default userRouter;
