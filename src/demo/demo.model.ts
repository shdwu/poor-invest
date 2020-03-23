import Demo from './demo.interface'
import * as mongoose from 'mongoose'

const demoSchema = new mongoose.Schema({
  name: String,
  idcard: String,
  relation: String,
  sex: String,
  age: String,
  town: String,
  vallage: String,
  moveYear: String,
  moveType: String,
  jobState: String,
  jobRegion: String,
  jobType: String,
  income: String,
  companyName: String,
  companyAddr: String,
}, { timestamps: true })

const allModel = mongoose.model<Demo & mongoose.Document>('All', demoSchema)

const partModel = mongoose.model<Demo & mongoose.Document>('Part', demoSchema)

export default  {allModel, partModel}
