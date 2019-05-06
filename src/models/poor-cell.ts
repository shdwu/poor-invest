import * as mongoose from "mongoose";

// 贫困户信息
export type PoorCellModel = mongoose.Document & {
  // 姓名
  name: string,
  // 乡镇
  adds_1: string,
  adds_2: string,
  adds_3: string,
  cell: {
    // 户编号
    cellCode: string,
    // 与户主关系
    relationship: string,
  },
  // 身份证号
  userCode: string,
  // 联系电话
  phone: string,
  // 就业情况
  jobState: string,
  // 无劳动力状态
  state: string,
  // 是否就业
  isJob: string,
  // 就业类型
  jobType: string,
  // 具体工种
  workType: string,
  // 就业地
  jobAdd: string,
  // 工资
  salary: number,
  // 是否有培训意愿
  train: string,
  // 培训意愿项目
  trainItem: string,
  // 未就业原因
  noJobSeason: string,

  // 帮扶人信息
  helpPerson: {
    // 姓名
    name: string,
    // 职务
    position: string,
    // 联系电话
    phone: string
  }
};


const poorCellSchema = new mongoose.Schema({
  name: String,
  adds_1: String,
  adds_2: String,
  adds_3: String,
  userCode: {type: String, unique: true},
  phone: String,
  jobState: String,
  state: String,
  isJob: String,
  jobType: String,
  workType: String,
  jobAdd: String,
  salary: Number,
  train: String,
  trainItem: String,
  noJobSeason: String,
  cell: {
    cellCode: String,
    relationship: String,
  },
  helpPerson: {
    name: String,
    position: String,
    phone: String
  }
}, { timestamps: true });

const PoorCell = mongoose.model("PoorCell", poorCellSchema);
export default PoorCell;
