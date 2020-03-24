import { Town } from './town.interface'
import * as mongoose from 'mongoose'
import { Village } from '../village'

const townSchema = new mongoose.Schema({
  name: { type: String, unique: true },
}, { timestamps: true })

const townModel = mongoose.model<Town & mongoose.Document>('Town', townSchema)

export { townModel }
