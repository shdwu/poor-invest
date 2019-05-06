import { Request, Response } from "express";
import xlsx from 'node-xlsx';
import { default as PoorCell, PoorCellModel } from "../models/poor-cell";

export let parseExcel = (req: Request, res: Response) => {
  const workSheets = xlsx.parse(req.file.buffer);
  let poorCells: Array<any> = [];
  if(workSheets && workSheets[0]) {
    workSheets[0].data.forEach((v: Array<string>, i) => {
      // 前两行不要
      if(i > 1 && v[3]) {
        let poorCell = new PoorCell({
          adds_1: v[0],
          adds_2: v[1],
          adds_3: v[2],
          name: v[3],
          cell: {
            cellCode: v[4],
            relationship: v[5]
          },
          userCode: v[6],
          phone: parseInt(v[7]),
          jobState: v[8],
          state: v[9],
          isJob: v[10],
          jobType: v[11],
          workType: v[12],
          jobAdd: v[13],
          salary: v[14],
          train: v[15],
          trainItem: v[16],
          noJobSeason: v[17],
          helpPerson: {
            // 姓名
            name: v[18],
            // 职务
            position: v[19],
            // 联系电话
            phone: v[20]
          }
        });
        poorCells.push(poorCell);
      }
    })
  }
  return res.json(poorCells);
};

export let enterDb = (req: Request, res: Response) => {
  let errs: any[] = [];
  req.body.forEach((v: any) => {
    new PoorCell(v).save((err: any) => {
      if (err) { errs.push(err)}
    });
    if(errs) {
      return res.json(errs.pop());
    }
    return res.json("入库成功");
  })
}