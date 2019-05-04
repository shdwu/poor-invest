"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};
const workerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    username: { type: String, unique: true },
    password: String,
    isBureau: Boolean
}, { timestamps: true });
workerSchema.pre("save", function save(next) {
    const worker = this;
    if (!worker.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(worker.password, salt, undefined, (err, hash) => {
            if (err) {
                return next(err);
            }
            worker.password = hash;
            next();
        });
    });
});
workerSchema.methods.comparePassword = comparePassword;
const Worker = mongoose.model("Worker", workerSchema);
exports.default = Worker;
//# sourceMappingURL=worker.js.map