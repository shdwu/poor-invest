import Poor from './poor.interface';
import * as mongoose from 'mongoose';

const poorSchema = new mongoose.Schema({
  name: String,
  town: {
    ref: 'Town',
    type: mongoose.Schema.Types.ObjectId
  },
  village: {
    ref: 'Village',
    type: mongoose.Schema.Types.ObjectId
  },
  team: String,
  userCode: {type: String, unique: true},
  phone: String,
  jobState: String,
  state: String,
  isJob: String,
  jobType: String,
  workType: String,
  jobAdd: String,
  salary: String,
  train: String,
  trainItem: String,
  noJobSeason: String,
  cell: {
    cellCode: String,
    relationship: String,
  },
  helpPerson: {
    name: String,
    position: String,
    phone: String
  }
}, { timestamps: true });

const poorModel = mongoose.model<Poor & mongoose.Document>('Poor', poorSchema);

export default poorModel;
