import express from 'express';
import authController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/sign-up', authController.signUp);

authRouter.post('/sign-in', authController.signIn);

authRouter.post('/sign-out', authController.auth, authController.signOut);

authRouter.post('/forgot-password', authController.forgotPassword);

authRouter.post('/reset-password', authController.resetPassword);

authRouter.post('/verify', authController.resendVerificationEmail);

authRouter.get('/verify/:verificationToken', authController.verifyUser);

export default authRouter;
