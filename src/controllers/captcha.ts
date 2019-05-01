import captcha = require("svg-captcha");
import { Request, Response } from "express";

export let getCaptcha = (req: Request, res: Response) => {
  const svgCaptcha: captcha.Captcha = captcha.create();
  req.session.captcha = svgCaptcha.text;
  res.type("svg");
  res.status(200).send(svgCaptcha.data);
}