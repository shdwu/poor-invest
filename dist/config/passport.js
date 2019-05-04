"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passportLocal = require("passport-local");
const worker_1 = require("../model/worker");
const LocalStrategy = passportLocal.Strategy;
passport.serializeUser((worker, done) => {
    done(undefined, worker.id);
});
passport.deserializeUser((id, done) => {
    worker_1.default.findById(id, (err, worker) => {
        done(err, worker);
    });
});
passport.use(new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
    worker_1.default.findOne({ username }, (err, worker) => {
        if (err) {
            return done(err);
        }
        if (!worker) {
            return done(undefined, false, { message: `${username} 不存在` });
        }
        worker.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, worker);
            }
            return done(undefined, false, { message: "用户名密码错误" });
        });
    });
}));
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    const platform = req.path.split("/").slice(1, 2)[0];
    res.redirect(`/${platform}/login`);
};
exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.username === "admin") {
        return next();
    }
    req.flash("errors", "需要管理员权限");
};
//# sourceMappingURL=passport.js.map