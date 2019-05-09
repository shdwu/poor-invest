import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";

export let updateAdds = (req: Request, res: Response) => {
  if(req.body.adds) {
    let json = JSON.stringify(req.body.adds);
    fs.writeFile(path.resolve(__dirname, "../config/adds.json"), json, "utf8", ()=> {
      res.json("更新成功");
    })
  }
}

export let getAdds = (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../config/adds.json"));
}