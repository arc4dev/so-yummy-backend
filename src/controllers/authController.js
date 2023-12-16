// const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const passport = require('../config/config-passport.js');

const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmailHelper.js');

// helpers
const signToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const url = (verificationToken, req) =>
  `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;

// Controller
const auth = async (req, res, next) => {
  await passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const signUp = async (req, res, next) => {
  try {
    const { body } = req;
    const { email, name, password } = body;

    // 1. Create a user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken: nanoid(),
    });

    // 2. Send verification email
    sendEmail(url(user.verificationToken, req), email);

    res.status(201).json({
      status: 'success',
      message:
        'Account created. Please check your email to verify your account and log in afterwards!',
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if password and email are provided
    if (!email || !password)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Please provide an email or password' });

    // 2. Check if user exists and password is correct
    const user = await User.findOne({
      email,
    }).select('password email verify name');

    if (!user || !(await user.isCorrectPassword(password, user.password)))
      return res
        .status(400)
        .json({ status: 'fail', message: 'The email or password is incorrect!' });

    // 3. Check if user verified his account
    if (!user.verify)
      return res.status(400).json({ status: 'fail', message: 'Please verify your email first!' });

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
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const restrictTo = role => (req, res, next) => {
  if (role !== req.user.role)
    return res
      .status(401)
      .json({ status: 'fail', message: 'You don not have permission to acces this route!' });

  next();
};

const signOut = async (req, res, next) => {
  try {
    // wylogowaniem musi byc dodanie tokena do czanrje listy i przy funkcji auth sprawdzanie czy token nalezy do tej listy

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    console.log(user);

    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    user.verify = true;
    user.verificationToken = null;

    await user.save();
    console.log(user);

    res
      .status(200)
      .json({ status: 'success', message: 'Verification successful. You can low log in!' });
  } catch (err) {
    res.status(400).send({ status: 'fail', message: err.message });
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user || user.verify)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Verification has already been passed' });

    sendEmail(url(user.verificationToken, req), email);

    res.status(200).json({ status: 'success', message: 'Verification email sent' });
  } catch (err) {
    res.status(400).send({ status: 'fail', message: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  auth,
  restrictTo,
  verifyUser,
  resendVerificationEmail,
};
