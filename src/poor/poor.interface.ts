import { Village } from '../village'
import { Town } from '../town'

export default interface Poor {
  // 乡(镇)
  town: Town,
  // 行政村
  village: Village,
  // 户编号
  houseCode: string,
  // 人编号
  personCode: string,
  // 姓名
  name: string,
  // 身份证号
  idcard: string,
  // 人数
  houseNum: number,
  // 是否是户主
  houseHead: boolean,
  // 与户主关系
  houseRelation: string,
  // 民族
  ethnic: string,
  // 文化程度
  cultureLevel: string,
  // 在校生状况
  schoolStatus: string,
  // 健康状况
  healthStatus: string,
  // 劳动技能
  workSkill: string,
  // 务工状况
  workStatus: string,
  // 务工时间（月）
  workTime: string,
  // 参加大病医疗
  healthInsurance: boolean,
  // 脱贫属性
  outPoorMeta: string,
  // 脱贫年度
  outPoorYear: number,
  // 致贫原因
  poorReason: string,
  // 危房户
  dangerHouse: boolean,
  // 是否解决安全饮用水
  safeWater: boolean,
  // 人均纯收入
  perIncome: number,
  // 联系电话
  phone: string,
  // 首次识别时间
  firstRecTime: string,
  // 贫困人员识别时间
  poorRecTime: string,

  // ============== 表格中的拓展,来着软件修改
  // 是否就业
  getJobStatus: boolean,
  // 是--选填务农、转移就业
  jobDetail: string,
  // 就业详细地址—就业单位名称—务工工种（选填建筑业、服务业、制造业、纺织业、其他）—月收入
  jobAddr: string,
  // 就业单位名称
  jobCompanyName: string,
  // 务工工种
  jobType: string,
  // 月收入
  jobIncome: string,
  // 否—选填：在校生—填写就读学校及年级
  noJobDetail: string,
  // 就读学校
  noJobSchool: string,
  // 年级
  noJobSchoolGrade: string,
  // 无劳动能力-选填中度残疾和高龄老人 参军 服刑 死亡
  noWorkAbility: string,
  // 选填是否有就业意愿 选填有/无（选择有的继续选填区内、区外市内、市外）
  wantWork: boolean,
  wantWorkAddr: string,
  // 选填是否有培训意愿
  wantTrain: boolean,
  // 培训工种(选填电子技术、烹饪技术、创业培训、农村实用技能、家庭服务业、其他)
  wantTrainType: string,
  // 选填是否有创业意愿
  wantPioneer: boolean,
  helpPerson: string,
  helpPersonPosition: string,
  helpPersonPhone: string,
}
