import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import recipeController from '../controllers/recipeController.js';

const userRouter = express.Router();

// Auth before all requests
userRouter.use(authController.auth);

userRouter.route('/me').get(userController.getCurrentUser);

userRouter.patch(
  '/update-me',
  userController.uploadUserImage,
  userController.updateUser
);

userRouter
  .route('/my-recipes')
  .get(recipeController.getOwnRecipes)
  .post(userController.uploadRecipeImage, recipeController.addOwnRecipe);

userRouter
  .route('/my-recipes/:recipeId')
  .delete(recipeController.deleteOwnRecipe);

userRouter
  .route('/favourite-recipes')
  .get(recipeController.getFavouriteRecipes)
  .post(recipeController.addFavouriteRecipe);

userRouter.delete(
  '/favourite-recipes/:recipeId',
  recipeController.deleteFavouriteRecipe
);

export default userRouter;
