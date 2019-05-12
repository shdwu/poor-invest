import { NextFunction, Request, Response } from "express";
import { default as PoorCell, PoorCellModel } from "../models/poor-cell";

export let getPoorCells = (req: Request, res: Response) => {
  const page = req.query.page - 1 || 0;
  PoorCell.find(null, null, {skip: 10 * page, limit: 10}, (err, poorCells: PoorCellModel[]) => {
    if (err) { return res.json(err); }
    PoorCell.find().count((err, num) => {
      if (err) { return res.json(err); }
      res.json({
        poorCells,
        page: page + 1,
        num
      });
    });
  });
};

export let delPoorCell = (req: Request, res: Response) => {
  if (req.query.id) {
    PoorCell.deleteOne({_id: req.query.id}).then(() => {
      res.json("删除成功");
    }).catch((err) => {
      res.json(err);
    });
  }
};

export let addPoorCell = (req: Request, res: Response) => {
  const poorCell = new PoorCell(req.body);

  PoorCell.findOne({username: req.body.username}, (err, existingWorker) => {
    if (err) { return res.status(400).json(err); }
    if (existingWorker) {
      return res.status(400).json("身份证已存在");
    }
    poorCell.save((err) => {
      if (err) { return res.status(400).json(err); }
      return res.json("新增贫困户成功");
    });
  });
};

export let updatePoorCell = (req: Request, res: Response) => {
  const poorCell = new PoorCell(req.body);

  PoorCell.findOne({username: req.body.username}, (err, existingWorker) => {
    if (err) { return res.status(400).json(err); }
    if (existingWorker) {
      return res.status(400).json("身份证已存在");
    }
    poorCell.save((err) => {
      if (err) { return res.status(400).json(err); }
      return res.json("新增贫困户成功");
    });
  });
};
