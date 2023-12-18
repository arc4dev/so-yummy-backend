import { NextFunction, Request, Response } from 'express';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ status: 'fail', message: err.message });
};
