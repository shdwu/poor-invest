import * as mongoose from "mongoose";

// 村镇
export type VillageModel = mongoose.Document & {
  // 村镇名
  name: string,
  // 详细名
  detailName: string
};

const villageSchema = new mongoose.Schema({
  name: String,
  detailName: String
}, { timestamps: true });

const Village = mongoose.model("Village", villageSchema);
export default Village;
