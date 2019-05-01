import * as mongoose from "mongoose";

// 贫困户信息
export type PoorCellModel = mongoose.Document & {
  // 姓名
  name: string,
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
  userCode: {type: String, unique: true},
  phone: String,
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
