import express from 'express';
import authController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/sign-up', authController.signUp);

authRouter.post('/sign-in', authController.signIn);

authRouter.post('/sign-out', authController.auth, authController.signOut);

authRouter.get('/verify/:verificationToken', authController.verifyUser);

authRouter.post('/verify', authController.resendVerificationEmail);

export default authRouter;
