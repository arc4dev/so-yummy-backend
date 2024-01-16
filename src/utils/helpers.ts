import { Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const signToken = (
  payload: {
    id: mongoose.Types.ObjectId;
    username: string;
  },
  isLogout = false
) =>
  jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: isLogout
      ? process.env.JWT_EXPIRATION_LOGOUT
      : process.env.JWT_EXPIRATION,
  });

type ObjectType = { [key: string]: any };

export const filterObj = <T extends ObjectType>(
  obj: T,
  allowedArr: (keyof T)[]
): Partial<T> => {
  return allowedArr.reduce((acc: Partial<T>, key: keyof T) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {});
};

export const sendJWT = (user: UserDocument, res: Response) => {
  const token = signToken({
    id: user.id,
    username: user.email,
  });

  res.status(200).json({
    status: 'success',
    data: {
      _id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
    token,
  });
};
