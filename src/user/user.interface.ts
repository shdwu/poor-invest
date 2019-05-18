import Town from '../town/town.interface';
import Village from '../village/village.interface';
import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

interface User {
  _id: string;
  // 姓名
  name: string;
  // 电话
  phone: string;
  // 用户名，用于系统登录
  username: string;
  // 密码，用于系统登录
  password: string;
  // 是否属于就业局
  isBureau: boolean;
  town: Town;
  village: Village;
  comparePassword: comparePasswordFunction;
}

export type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

const comparePassword: comparePasswordFunction = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

export default User;
