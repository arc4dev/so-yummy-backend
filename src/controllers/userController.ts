import e, { RequestHandler } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObj } from '../utils/helpers.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req) => {
    const { id } = req?.user as UserDocument;

    return {
      folder: 'avatars',
      allowedFormats: ['jpg', 'jpeg', 'png'],
      public_id: `${id}`,
      transformation: [
        { width: 250, height: 250, crop: 'limit' },
        { quality: 100 },
        { fetch_format: 'auto' },
        { format: 'jpg', filename: `${id}` },
      ],
    };
  },
});

const recipeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (_) => {
    return {
      folder: 'recipes',
      allowedFormats: ['jpg', 'jpeg', 'png'],
      transformation: [
        { width: 600, height: 600, crop: 'fill' },
        { format: 'jpg' },
      ],
    };
  },
});

const fileFilter = (
  _: e.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new Error('Not an image! Please upload only images.'));
};

const userImage = multer({
  storage: avatarStorage,
  fileFilter,
});

const recipeImage = multer({
  storage: recipeStorage,
  fileFilter,
});

const uploadUserImage = userImage.single('avatar');
const uploadRecipeImage = recipeImage.single('image');

const getCurrentUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;

  const user = await User.findById(id).select('_id name email image');
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'User not found' });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;

  const filteredBody = filterObj(req.body, ['email', 'name']);
  if (req.file) filteredBody.image = req.file.path;

  const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser)
    return res.status(404).json({ status: 'fail', message: 'User not found!' });

  res.status(200).json({
    status: 'success',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    },
  });
});

export default {
  getCurrentUser,
  uploadUserImage,
  uploadRecipeImage,
  updateUser,
};
