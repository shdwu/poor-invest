import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function authMiddleware(request: Request, response: Response, next: NextFunction) {
  process.stdout.write(request.path);
  // After successful login, redirect back to the intended page
  if (!request.user &&
    request.path !== '/auth/login' &&
    request.path !== '/auth/captcha' ) {
      next(new HttpException(401, '请登陆'));
  }
  next();
}

export default authMiddleware;
