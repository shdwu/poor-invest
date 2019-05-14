import * as mongoose from 'mongoose';
import Dictionary from './dictionary.interface';

const dictionarySchema = new mongoose.Schema({
  key: String,
  value: String
}, { timestamps: true });

const dictionaryModel = mongoose.model<Dictionary & mongoose.Document>('Dictionary', dictionarySchema);

export default dictionaryModel;
