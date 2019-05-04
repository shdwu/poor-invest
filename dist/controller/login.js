"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
require("../config/passport");
exports.mobileLogin = (req, res) => {
    if (req.user) {
        return res.redirect("/mobile");
    }
    res.render("mobile/login", {
        title: "Login"
    });
};
exports.mobileLogout = (req, res) => {
    req.logout();
    res.redirect("/mobile");
};
exports.pcLogin = (req, res) => {
    if (req.user) {
        return res.redirect("/pc");
    }
    res.render("pc/login", {
        title: "Login"
    });
};
exports.pcLogout = (req, res) => {
    req.logout();
    res.redirect("/pc");
};
exports.postLogin = (req, res, next) => {
    req.assert("username", "用户名错误").exists();
    req.assert("password", "密码错误").exists();
    req.assert("code", "验证码错误").exists()
        .custom((value) => {
        if (req.session.captcha) {
            return value.toUpperCase() === req.session.captcha.toUpperCase();
        }
        return false;
    });
    const errors = req.validationErrors();
    const platform = req.path.split("/").slice(1, 2)[0];
    if (errors) {
        req.flash("errors", errors);
        return res.redirect(`/${platform}/login`);
    }
    passport.authenticate("local", (err, worker, info) => {
        if (err) {
            return next(err);
        }
        if (!worker) {
            req.flash("errors", info.message);
            return res.redirect(`/${platform}/login`);
        }
        req.logIn(worker, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", { msg: "登录成功" });
            res.redirect(req.session.returnTo || `/${platform}/`);
        });
    })(req, res, next);
};
//# sourceMappingURL=login.js.map