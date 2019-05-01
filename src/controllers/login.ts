import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";
import * as crypto from "crypto";
import passport = require("passport");
import { default as Worker, WorkerModel} from "../models/worker";
import request = require("request");
import { IVerifyOptions } from "passport-local";
import "../config/passport";

export let login = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("/pc");
  }
  res.render("pc/login", {
    title: "Login"
  });
};

export let pcLogout = (req: Request, res: Response) => {
  req.logout();
  res.redirect("/pc");
};

// =============== Common ====================

export let postLogin = (req: Request, res: Response, next: NextFunction) => {
  req.assert("username", "用户名错误").exists();
  req.assert("password", "密码错误").exists();
  req.assert("code", "验证码错误").exists()
  .custom((value) => {
    if (req.session.captcha) {
      return (value as string).toUpperCase() === req.session.captcha.toUpperCase();
    }
    return false;
  });

  const errors = req.validationErrors();

  const platform = req.path.split("/").slice(1, 2)[0];

  if (errors) {
    req.flash("errors", errors);
    return res.redirect(`/${platform}/login`);
  }

  passport.authenticate("local", (err: Error, worker: WorkerModel, info: IVerifyOptions) => {
    if (err) { return next(err); }
    if (!worker) {
      req.flash("errors", info.message);
      return res.redirect(`/${platform}/login`);
    }
    req.logIn(worker, (err) => {
      if (err) { return next(err); }
      req.flash("success", { msg: "登录成功" });
      res.redirect(req.session.returnTo || `/${platform}/`);
    });
  })(req, res, next);
};
