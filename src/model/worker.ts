import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

// 工作人员
export type WorkerModel = mongoose.Document & {
  // 姓名
  name: string,
  // 电话
  phone: string,
  // 用户名，用于系统登录
  username: string,
  // 密码，用于系统登录
  password: string,
  comparePassword: comparePasswordFunction
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

const comparePassword: comparePasswordFunction = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

const workerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  username: {type: String, unique: true},
  password: String
}, { timestamps: true });

workerSchema.pre("save", function save(next) {
  const worker = this as WorkerModel;
  if (!worker.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(worker.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      worker.password = hash;
      next();
    });
  });
});

workerSchema.methods.comparePassword = comparePassword;

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
