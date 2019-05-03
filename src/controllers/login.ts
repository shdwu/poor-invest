import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";
import * as crypto from "crypto";
import passport = require("passport");
import { default as Worker, WorkerModel} from "../models/worker";
import request = require("request");
import { IVerifyOptions } from "passport-local";
import "../config/passport";
import message from "../util/message";

export let logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect("/pc");
};

export let postLogin = (req: Request, res: Response) => {
  if (req.user) {
    return res.send();
  }
  req.assert("username", "用户名错误").exists();
  req.assert("password", "密码错误").exists();
  req.assert("code", "验证码错误").exists()
  .custom((value) => {
    if (req.session.captcha && value) {
      return (value as string).toUpperCase() === req.session.captcha.toUpperCase();
    }
    return false;
  });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({errors});
  }

  passport.authenticate("local", (err: Error, worker: WorkerModel, info: IVerifyOptions) => {
    if (err) { return res.status(400).json({errors: err}); }
    if (!worker) {
      return res.status(400).json(message("errors", "用户名密码错误"));
    }
    req.logIn(worker, (err) => {
      if (err) { return res.status(400).json(message("errors", err)); }
      res.json(message("errors", "登陆成功"));
    });
  })(req, res);
};
