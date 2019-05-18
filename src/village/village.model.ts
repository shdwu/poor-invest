import Village from './village.interface';
import * as mongoose from 'mongoose';
import townModel from '../town/town.model';

const VillageSchema = new mongoose.Schema({
  name: String,
  town: {
    ref: 'Town',
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

VillageSchema.post('save', doc => {
  const village = doc as unknown as Village;
  townModel.findById(village.town).then( town => {
    if (town) {
      town.villages.push(village);
      town.save();
    }
  });
});

const villageModel = mongoose.model<Village & mongoose.Document>('Village', VillageSchema);

export default villageModel;
