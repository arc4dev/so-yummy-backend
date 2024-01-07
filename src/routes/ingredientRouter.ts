import express from 'express';

import authController from '../controllers/authController.js';
import ingredientController from '../controllers/ingredientController.js';

const ingredientRouter = express.Router();

// Auth before all requests
ingredientRouter.use(authController.auth);

ingredientRouter.get(
  '/:ingredient',
  ingredientController.getIngredientsByQuery
);

export default ingredientRouter;
