import passport = require('passport');
import request = require('request');
import passportLocal = require('passport-local');
import User from '../user/user.interface';
import userModel from '../user/user.model';
import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, (err: any, user: User) => {
    user.password = undefined;
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  userModel.findOne({ username }).then(user => {
    if (!user) {
      return done(undefined, false, { message: `${username} 不存在` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: '用户名密码错误' });
    });
  }).catch(err => {
    return done(err);
  });
}));

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new HttpException(401, '请登陆'));
};

/**
 * Admin Required middleware.
 */
export let isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.username === 'admin') {
    return next();
  }
  next(new HttpException(401, '权限不足'));
};
