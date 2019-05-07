import { NextFunction, Request, Response } from "express";
import { default as PoorCell, PoorCellModel } from "../models/poor-cell";

export let getPoorCells = (req: Request, res: Response) => {
  const page = req.query.page - 1 || 0;
  PoorCell.find(null, null, {skip: 10 * page, limit: 10}, (err, poorCells: PoorCellModel[]) => {
    if (err) { return res.json(err); }
    PoorCell.find().count((err, num) => {
      if (err) { return res.json(err);}
      res.json({
        poorCells,
        page: page + 1,
        num
      });
    });
  });
}

export let delPoorCell = (req: Request, res: Response) => {
  if(req.query.id) {
    PoorCell.deleteOne({_id: req.query.id}).then(() => {
      res.json("删除成功")
    }).catch((err) => {
      res.json(err);
    })
  }
}