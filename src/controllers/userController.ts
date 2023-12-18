import { RequestHandler } from 'express';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

const getCurrentUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;

  if (!id)
    return res.status(404).json({ status: 'fail', message: 'User not found' });

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'User not found' });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export default {
  getCurrentUser,
};
