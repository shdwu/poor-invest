import * as mongoose from 'mongoose';
import {default as User, comparePasswordFunction} from './user.interface';
import * as bcrypt from 'bcrypt-nodejs';

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

userSchema.pre('save', function save(next) {
  const user = this as User & mongoose.Document;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

userSchema.methods.comparePassword = comparePassword;

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
