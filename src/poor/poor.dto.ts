import { IsString, ValidateIf } from 'class-validator'

class CreatePoorDto {
  // 姓名
  @IsString({message: '姓名不能为空'})
  public name: string
  // 乡镇
  public town: string
  public village: string
  public team: string
  public cell: {
    // 户编号
    cellCode: string,
    // 与户主关系
    relationship: string,
  }
  // 身份证号
  @IsString({message: '身份证不能为空'})
  public userCode: string
  // 联系电话
  @IsString({message: '联系电话不能为空'})
  public phone: string
  // 就业情况
  public jobState: string
  // 无劳动力状态
  public state: string
  // 是否就业
  public isJob: string
  // 是否有就业意愿
  public wantJob: string
  // 就业类型
  public jobType: string
  // 具体工种
  public workType: string
  // 就业地
  public jobAdd: string
  // 工资
  public salary: number
  // 是否有培训意愿
  public train: string
  // 培训意愿项目
  public trainItem: string
  // 培训项目详情
  public trainDetil: string
  // 未就业原因
  public noJobSeason: string

  // 帮扶人信息
  public helpPerson: {
    // 姓名
    name: string,
    // 职务
    position: string,
    // 联系电话
    phone: string
  }
}

export default CreatePoorDto
