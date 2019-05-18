import Town from './town.interface';
import * as mongoose from 'mongoose';
import villageModel from '../village/village.model';

const townSchema = new mongoose.Schema({
  name: String,
  villages: [{
    ref: 'Village',
    type: mongoose.Schema.Types.ObjectId
  }]
}, { timestamps: true });

townSchema.post('remove', doc => {
  const town = doc as unknown as Town;
  villageModel.findByIdAndRemove({town: town._id});
});

const townModel = mongoose.model<Town & mongoose.Document>('Town', townSchema);

export default townModel;
