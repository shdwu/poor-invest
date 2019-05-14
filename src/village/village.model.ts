import Village from './village.interface';
import * as mongoose from 'mongoose';

const VillageSchema = new mongoose.Schema({
  name: String,
  town: {
    ref: 'Town',
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

const villageModel = mongoose.model<Village & mongoose.Document>('Village', VillageSchema);

export default villageModel;
