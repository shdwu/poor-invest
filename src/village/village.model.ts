import Village from './village.interface';
import { User, userModel } from '../user';
import * as mongoose from 'mongoose';

const villageSchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

villageSchema.post('save', doc => {

});

const villageModel = mongoose.model<Village & mongoose.Document>('Village', villageSchema);

export default villageModel;
