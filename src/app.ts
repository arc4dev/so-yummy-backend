import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import errorController from './controllers/errorController.js';
import recipeRouter from './routes/recipeRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import shoppingListRouter from './routes/shoppingListRouter.js';
import ingredientRouter from './routes/ingredientRouter.js';

const app = express();

// Middlewares
app.use(morgan(app.get('env') === 'development' ? 'dev' : 'short'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/shopping-list', shoppingListRouter);

// Handle not defined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found!' });
});

// Error Handler
app.use(errorController);

export default app;
