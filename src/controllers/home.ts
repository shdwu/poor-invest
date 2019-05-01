import { Request, Response } from "express";
import path = require("path");

export let pcIndex = (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "/dist/public/pc/index.html"));
};

export let mobileIndex = (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "/dist/public/mobile/index.html"));
};
