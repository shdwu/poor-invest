import Poor from './poor.interface'
import * as mongoose from 'mongoose'

const poorSchema = new mongoose.Schema({
  // 姓名
  name: String,
  // 村社街道
  village: {
    ref: 'Village',
    type: mongoose.Schema.Types.ObjectId,
  },
  // 身份证号
  idcard: {type: String, unique: true},
  // 详细住址
  addr: String,
  // 就业状态 是否就业
  jobState: Boolean,

  state: String,
  isJob: String,
  wantJob: String,
  jobType: String,
  workType: String,
  jobAdd: String,
  salary: String,
  train: String,
  trainItem: String,
  trainDetil: String,
  noJobSeason: String,
  cell: {
    cellCode: String,
    relationship: String,
  },
  helpPerson: {
    name: String,
    position: String,
    phone: String,
  },
}, { timestamps: true })

const poorModel = mongoose.model<Poor & mongoose.Document>('Poor', poorSchema)

export default poorModel
