import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import errorController from './controllers/errorController.js';
import Recipe from './models/recipeModel.js';

dotenv.config();
const app = express();

// Middlewares
app.use(morgan(app.get('env') === 'development' ? 'dev' : 'short'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/recipes', async (req, res) => {
  res.json({
    message: 'success',
    data: null,
  });
});

// Handle not defined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found!' });
});

// Error Handler
app.use(errorController);

export default app;
