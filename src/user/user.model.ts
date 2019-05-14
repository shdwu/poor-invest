import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  username: { type: String, unique: true },
  password: String,
  isBureau: Boolean,
  town: {
    ref: 'Town',
    type: mongoose.Schema.Types.ObjectId
  },
  village: {
    ref: 'Village',
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
