import { Request, RequestHandler } from 'express';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import passport from '../config/config-passport.js';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import catchAsync from '../utils/catchAsync.js';

// helpers
const signToken = (payload: {
  id: mongoose.Types.ObjectId;
  username: string;
}) =>
  jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const url = (verificationToken: string, req: Request) =>
  `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;

// Controller
const auth: RequestHandler = async (req, res, next) => {
  await passport.authenticate(
    'jwt',
    { session: false },
    async (err: any, user: Express.User | undefined) => {
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
};

const signUp: RequestHandler = catchAsync(async (req, res, next) => {
  const { body } = req;
  const { email, name, password } = body;

  // 1. Create a user
  const user = await User.create({
    name,
    email,
    password,
    verificationToken: nanoid(),
  });

  if (!user.verificationToken)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Something went wrong' });

  // 2. Send verification email
  sendEmail(url(user.verificationToken, req), email);

  res.status(201).json({
    status: 'success',
    message:
      'Account created. Please check your email to verify your account and log in afterwards!',
  });
});

const signIn: RequestHandler = async (req, res, next) => {
  try {
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
    }).select('password email verify name');

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

    // 4. If everything is ok, send token to client
    const token = signToken({
      id: user.id,
      username: email,
    });

    res.status(200).json({
      status: 'success',
      data: { email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: (err as Error).message });
  }
};

const signOut: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: (err as Error).message });
  }
};

const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user)
      return res
        .status(404)
        .json({ status: 'fail', message: 'User not found' });

    user.verify = true;
    user.verificationToken = null;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Verification successful. You can low log in!',
    });
  } catch (err) {
    res.status(400).send({ status: 'fail', message: (err as Error).message });
  }
};

const resendVerificationEmail: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user || user.verify)
      return res.status(400).json({
        status: 'fail',
        message: 'Verification has already been passed',
      });

    if (!user.verificationToken)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Something went wrong' });

    sendEmail(url(user.verificationToken, req), email);

    res
      .status(200)
      .json({ status: 'success', message: 'Verification email sent' });
  } catch (err) {
    res.status(400).send({ status: 'fail', message: (err as Error).message });
  }
};

export default {
  signUp,
  signIn,
  signOut,
  auth,
  verifyUser,
  resendVerificationEmail,
};
