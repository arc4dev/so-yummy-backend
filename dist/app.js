import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import errorController from './controllers/errorController.js';
import recipeRouter from './routes/recipeRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
dotenv.config();
const app = express();
// Middlewares
app.use(morgan(app.get('env') === 'development' ? 'dev' : 'short'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
// Handle not defined routes
app.all('*', (req, res, next) => {
    res.status(404).json({ message: 'Route not found!' });
});
// Error Handler
app.use(errorController);
export default app;
