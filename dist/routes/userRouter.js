import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
const userRouter = express.Router();
// Auth before all requests
userRouter.use(authController.auth);
userRouter.get('/current', userController.getCurrentUser);
export default userRouter;
