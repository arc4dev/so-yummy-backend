import express from 'express';

import authController from '../controllers/authController.js';
import shoppingListController from '../controllers/shoppingListController.ts.js';

const shoppingListRouter = express.Router();

// Auth before all requests
shoppingListRouter.use(authController.auth);

shoppingListRouter
  .route('/')
  .get(shoppingListController.getIngredients)
  .post(shoppingListController.addIngredient)
  .delete(shoppingListController.removeIngredient);

export default shoppingListRouter;
