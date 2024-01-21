import { RequestHandler } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObj } from '../utils/helpers.js';

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

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new Error('Not an image! Please upload only images.'));
  },
});

const uploadImage = upload.single('image');

const resizePhoto = (type: 'user' | 'recipe') => {
  return catchAsync(async (req, res, next) => {
    console.log(req.file);
    if (!req.file) return next();

    const { id, image } = req.user as UserDocument;

    const directoryPath = type === 'user' ? 'img/users' : 'img/recipes';

    // if (image && !image.includes('default')) {
    //   const pathname = path.join(
    //     process.cwd(),
    //     `public/${directoryPath}`,
    //     image.split('/').pop()!
    //   );

    //   await fs.unlink(pathname);
    // }

    req.file.filename = `${type}-${id}-${Date.now()}.jpeg`;
    req.file.path = `${req.protocol}://${req.get('host')}/${directoryPath}/${
      req.file.filename
    }`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .toFile(`./public/${directoryPath}/${req.file.filename}`);

    next();
  });
};

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;

  const filteredBody = filterObj(req.body, ['email', 'name']);
  if (req.file) filteredBody.image = req.file.path;

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
