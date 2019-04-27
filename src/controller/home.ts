import { Request, Response } from "express";

export let pcIndex = (req: Request, res: Response) => {
  res.render("pc/home", {
    title: "Home"
  });
};

export let mobileIndex = (req: Request, res: Response) => {
  res.render("mobile/home", {
    title: "Home"
  });
};
