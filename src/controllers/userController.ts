import { RequestHandler } from 'express';
import User from '../models/userModel.js';

const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.user as { id: string }; // to fix

    if (!id)
      return res
        .status(404)
        .json({ status: 'fail', message: 'User not found' });

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: (err as Error).message });
  }
};

export default {
  getCurrentUser,
};
