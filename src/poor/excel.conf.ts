const conf: any = {}

function convetUndefined(row: any, cellData: any) {
  return cellData ? cellData : ''
}

function convetBool(row: any, cellData: any) {
  return cellData ? '是' : '否'
}

// conf.stylesXmlFile = 'styles.xml'
conf.name = 'sheet'
conf.cols = [{
  caption: '乡(镇)',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '行政村',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '户编号',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '人编号',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '姓名',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '身份证号',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '是否是户主',
  type: 'string',
  beforeCellWrite: convetBool,
},
{
  caption: '与户主关系',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '是否就业',
  type: 'string',
},
{
  caption: '就业详情',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '就业详细地址',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '就业单位名称',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '务工工种',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '月收入',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '未就业详情',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '就读学校',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '就读学校年级',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '无劳动能力详情',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '是否有就业意愿',
  type: 'string',
  beforeCellWrite: convetBool,
},
{
  caption: '就业意愿地址',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '是否有创业意愿',
  type: 'string',
  beforeCellWrite: convetBool,
},
{
  caption: '创业类型',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '帮扶人',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '帮扶人职位',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '帮扶人电话',
  type: 'string',
  beforeCellWrite: convetUndefined,
},
{
  caption: '更新时间',
  type: 'string',
},
]

export { conf }
