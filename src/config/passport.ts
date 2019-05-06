import passport = require("passport");
import request = require("request");
import passportLocal = require("passport-local");
import Worker from "../models/worker";
import { Request, Response, NextFunction } from "express";
import message from "../util/message";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((worker, done) => {
  done(undefined, worker.id);
});

passport.deserializeUser((id, done) => {
  Worker.findById(id, (err, worker) => {
    done(err, worker);
  });
});

passport.use(new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
  Worker.findOne({ username }, (err, worker: any) => {
    if (err) { return done(err); }
    if (!worker) {
      return done(undefined, false, { message: `${username} 不存在` });
    }
    worker.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, worker);
      }
      return done(undefined, false, { message: "用户名密码错误" });
    });
  });
}));

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const platform = req.path.split("/").slice(1, 2)[0];
  res.redirect(`/${platform}/login`);
};

/**
 * Admin Required middleware.
 */
export let isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.username === "admin") {
    return next();
  }
  res.json("需要管理员权限");
};
