import Town from './town.interface';
import * as mongoose from 'mongoose';

const townSchema = new mongoose.Schema({
  name: String
}, { timestamps: true });

const townModel = mongoose.model<Town & mongoose.Document>('Town', townSchema);

export default townModel;
