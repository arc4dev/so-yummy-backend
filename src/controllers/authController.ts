import { Request, RequestHandler } from 'express';

import Email from '../utils/email.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import passport from '../config/config-passport.js';
import { sendJWT } from '../utils/helpers.js';

const url = (verificationToken: string, req: Request) =>
  `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;

const auth: RequestHandler = catchAsync(async (req, res, next) => {
  await passport.authenticate(
    'jwt',
    { session: false },
    async (err: Error | null, user: UserDocument | false) => {
      if (!user || err) {
        return res.status(401).json({
          status: 'fail',
          message: 'Unauthorized',
        });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
});

const signUp: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    verificationToken: nanoid(),
  });

  try {
    await new Email(email, url(user.verificationToken!, req)).sendWelcome();
  } catch (error) {
    await user.deleteOne();

    return res.status(500).json({
      status: 'fail',
      message: 'We could not send you an email! Please try again later.',
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Account created. Please check your email to verify your account!',
  });
});

const signIn: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if password and email are provided
  if (!email || !password)
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide an email or password',
    });

  // 2. Check if user exists and password is correct
  const user = await User.findOne({
    email,
  }).select('+password +verify +_id');

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return res.status(400).json({
      status: 'fail',
      message: 'The email or password is incorrect!',
    });

  // 3. Check if user verified his account
  if (!user.verify)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Please verify your email first!' });

  // 4. If everything is ok, send the token to client
  sendJWT(user, res);
});

const verifyUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user)
    return res.status(404).json({ status: 'fail', message: 'User not found' });

  user.verify = true;
  user.verificationToken = null;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Verification successful. You can low log in!',
  });
});

const resendVerificationEmail: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    }).select('+verify +verificationToken');

    if (!user || user.verify)
      return res.status(400).json({
        status: 'fail',
        message: 'Verification has already been passed',
      });

    if (!user.verificationToken)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Something went wrong' });

    await new Email(email, url(user.verificationToken!, req)).sendWelcome();

    res
      .status(200)
      .json({ status: 'success', message: 'Verification email sent' });
  }
);

const forgotPassword: RequestHandler = catchAsync(async (req, res, next) => {
  // 1) Get user by email (POST email)
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({ status: 'fail', message: 'User not found' });

  // 2) Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send the token to user's email
  try {
    await new Email(
      user.email,
      `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`
    ).sendPasswordResetToken();
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetTokenExpiration = null;

    return res.status(500).json({
      status: 'fail',
      message: 'We could not send you a reset token. Please try again later!',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to an email!',
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // 1) Find user by token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });

  // 2) Check if user exists and if the token did not expired
  if (!user)
    return res.status(404).json({
      status: 'fail',
      message: 'User not found or token expired. Please try again!',
    });

  // 3) Set a new password
  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetTokenExpiration = null;

  // 5) Save the user
  await user.save();

  // 6) Log in the user, send JWT
  sendJWT(user, res);
});

const signOut: RequestHandler = catchAsync(async (req, res, next) => {
  // ! We cannot log out user because we use JWT tokens !
  // Black listing JWT tokens is not an optimal solution
  // We can only delete the token from the client and keep short expiration time

  res.status(200).json({
    status: 'success',
    message: 'User logged out',
  });
});

const restrictTo =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    if (!roles.includes((req.user as UserDocument).role))
      return next(
        res.status(403).json({ status: 'fail', message: 'Access denied' })
      );

    next();
  };

export default {
  signUp,
  signIn,
  signOut,
  auth,
  verifyUser,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  restrictTo,
};
