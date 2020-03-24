import { Village } from './village.interface'
import { User, userModel } from '../user'
import * as mongoose from 'mongoose'

const villageSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  town: {
    ref: 'Town',
    type: mongoose.Schema.Types.ObjectId,
  },
}, { timestamps: true })


const villageModel = mongoose.model<Village & mongoose.Document>('Village', villageSchema)

export { villageModel }
