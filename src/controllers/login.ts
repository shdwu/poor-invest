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
  res.send();
};

export let postLogin = (req: Request, res: Response) => {
  if (req.user) {
    // tslint:disable-next-line:max-line-length
    return res.json({username: req.user.username, name: req.user.name, phone: req.user.phone, isBureau: req.user.isBureau});
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

  const errors: Record<string, any> | any[] = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors.pop().msg);
  }

  passport.authenticate("local", (err: Error, worker: WorkerModel, info: IVerifyOptions) => {
    if (err) { return res.status(400).json(err); }
    if (!worker) {
      return res.status(400).json("用户名密码错误");
    }
    req.logIn(worker, (err) => {
      if (err) { return res.status(400).json(err); }
      res.json({username: worker.username, name: worker.name, phone: worker.phone, isBureau: worker.isBureau});
    });
  })(req, res);
};

export let current = (req: Request, res: Response) => {
  return res.json(req.user);
}
