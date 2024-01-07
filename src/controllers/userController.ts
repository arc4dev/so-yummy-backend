import { RequestHandler } from 'express';

import multer from 'multer';
import sharp from 'sharp';
import User from '../models/UserModel.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObj } from '../utils/helpers.js';

const getCurrentUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'User not found' });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new Error('Not an image! Please upload only images.'));
  },
});

const uploadImage = upload.single('image');

const resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const { id } = req.user as UserDocument;

  req.file.filename = `user-${id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`./public/img/users/${req.file.filename}`);

  next();
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;

  const filteredBody = filterObj(req.body, ['email', 'name']);
  if (req.file) filteredBody.image = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

export default {
  getCurrentUser,
  uploadImage,
  resizePhoto,
  updateUser,
};
