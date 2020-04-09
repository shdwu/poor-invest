import Poor from './poor.interface'
import * as mongoose from 'mongoose'

const poorSchema = new mongoose.Schema({
  // 乡(镇)
  town: {
    ref: 'Town',
    type: mongoose.Schema.Types.ObjectId,
  },
  // 行政村
  village: {
    ref: 'Village',
    type: mongoose.Schema.Types.ObjectId,
  },
  // 户编号
  houseCode: String,
  // 人编号
  personCode: String,
  // 姓名
  name: String,
  // 身份证号
  idcard: {type: String, unique: true},
  // 人数
  houseNum: Number,
  // 是否是户主
  houseHead: Boolean,
  // 与户主关系
  houseRelation: String,
  // 民族
  ethnic: String,
  // 文化程度
  cultureLevel: String,
  // 在校生状况
  schoolStatus: String,
  // 健康状况
  healthStatus: String,
  // 劳动技能
  workSkill: String,
  // 务工状况
  workStatus: String,
  // 务工时间（月）
  workTime: String,
  // 参加大病医疗
  healthInsurance: Boolean,
  // 脱贫属性
  outPoorMeta: String,
  // 脱贫年度
  outPoorYear: String,
  // 致贫原因
  poorReason: String,
  // 危房户
  dangerHouse: Boolean,
  // 是否解决安全饮用水
  safeWater: Boolean,
  // 人均纯收入
  perIncome: Number,
  // 联系电话
  phone: String,
  // 首次识别时间
  firstRecTime: String,
  // 贫困人员识别时间
  poorRecTime: String,

  // ============== 表格中的拓展,来着软件修改
  // 是否就业
  getJobStatus: Boolean,
  // 是--选填务农、转移就业
  jobDetail: String,
  // 就业详细地址—就业单位名称—务工工种（选填建筑业、服务业、制造业、纺织业、其他）—月收入
  jobAddr: String,
  // 就业单位名称
  jobCompanyName: String,
  // 务工工种
  jobType: String,
  // 月收入
  jobIncome: String,
  // 否—选填：在校生—填写就读学校及年级
  noJobDetail: String,
  // 就读学校
  noJobSchool: String,
  // 年级
  noJobSchoolGrade: String,
  // 无劳动能力-选填中度残疾和高龄老人 参军 服刑 死亡
  noWorkAbility: String,
  // 选填是否有就业意愿 选填有/无（选择有的继续选填区内、区外市内、市外）
  wantWork: Boolean,
  wantWorkAddr: String,
  // 选填是否有培训意愿
  wantTrain: Boolean,
  // 培训工种(选填电子技术、烹饪技术、创业培训、农村实用技能、家庭服务业、其他)
  wantTrainType: String,
  // 选填是否有创业意愿
  wantPioneer: Boolean,
  helpPerson: String,
  helpPersonPosition: String,
  helpPersonPhone: String,
  createType: String,
  createAdd: String,
}, { timestamps: true })

const poorModel = mongoose.model<Poor & mongoose.Document>('Poor', poorSchema)

export default poorModel
