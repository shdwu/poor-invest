import { NextFunction, Request, Response } from "express";
import { default as PoorCell, PoorCellModel } from "../models/poor-cell";

export let getPoorCells = (req: Request, res: Response) => {
  const page = req.params.page || 0;
  PoorCell.find(null, null, {skip: 10 * page, limit: 10}, (err, poorCells: PoorCellModel[]) => {
    if (err) { return res.json(err); }
    PoorCell.find().count((err, num) => {
      if (err) { return res.json(err);}
      res.json({
        poorCells,
        page,
        num
      });
    });
  });
}