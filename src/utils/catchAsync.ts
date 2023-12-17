import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default catchAsync;
