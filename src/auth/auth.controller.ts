import * as express from 'express';
import Controller from '../interfaces/controller.interfaces';
import User from '../user/user.interface';
import userModel from '../user/user.model';
import validationMiddleware from '../middleware/validation.middleware';
import PostLoginDto from './auth.dto';
import * as passport from 'passport';
import { isAuthenticated, isAdmin } from '../config/passport';
import { IVerifyOptions } from 'passport-local';
import HttpException from '../exceptions/HttpException';
import captcha = require('svg-captcha');

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validationMiddleware(PostLoginDto), this.login);
    this.router.get(`${this.path}/logout`,  isAuthenticated, this.logout);
    this.router.get(`${this.path}/current`, isAuthenticated, this.current);
    this.router.get(`${this.path}/captcha`, this.captcha);
  }

  private captcha(req: express.Request, res: express.Response) {
    const svgCaptcha: captcha.Captcha = captcha.create();
    req.session.captcha = svgCaptcha.text;
    res.type('svg');
    res.status(200).send(svgCaptcha.data);
  }

  private current(req: express.Request, res: express.Response) {
    if (req.user) {
      return res.send(req.user);
    }
    res.send();
  }

  private logout(req: express.Request, res: express.Response) {
    if (req.user) {
      req.logout();
    }
    res.send();
  }

  private login(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.user) {
      return res.send(req.user);
    }

    if ( !req.session.captcha || req.body.code.toUpperCase() !== req.session.captcha.toUpperCase()) {
      next(new HttpException(400, '验证码错误'));
    }

    passport.authenticate('local', (err: Error, user: User, info: IVerifyOptions) => {
      if (err) { next(new HttpException(400, err.message)); }
      if (!user) {
        next(new HttpException(400, '用户名密码错误'));
      } else {
        req.logIn(user, (err) => {
          if (err) { next(new HttpException(400, err.message)); }
          res.send(req.user);
        });
      }
    })(req, res);
  }
}

export default AuthController;
export { isAuthenticated, isAdmin };
