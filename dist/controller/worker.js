"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("../model/worker");
exports.getWorker = (req, res) => {
    res.render("pc/worker/profile", {
        title: "Account Management"
    });
};
exports.getWorkerList = (req, res) => {
    const page = req.params.page || 0;
    worker_1.default.find(null, null, { skip: 10 * page, limit: 10 }, (err, workers) => {
        if (err) {
            return req.flash("errors", err);
        }
        res.render("pc/worker/list", {
            title: "Worker List",
            workers
        });
    });
};
exports.postAddWorker = (req, res, next) => {
    req.assert("username", "用户名不能为空").exists();
    req.assert("password", "登录密码不能为空").exists();
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/pc/worker/list");
    }
    const worker = new worker_1.default({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name || "",
        phone: req.body.phone || ""
    });
    worker_1.default.findOne({ username: req.body.username }, (err, existingWorker) => {
        if (err) {
            return next(err);
        }
        if (existingWorker) {
            req.flash("errors", "用户名已存在");
            return res.redirect("/pc/worker/list");
        }
        worker.save((err) => {
            if (err) {
                return next(err);
            }
        });
    });
};
exports.postWorker = (req, res, next) => {
    worker_1.default.findById(req.user.id, (err, worker) => {
        if (err) {
            return next(err);
        }
        worker.name = req.body.name || "";
        worker.phone = req.body.phone || "";
        if (req.body.username) {
            worker.username = req.body.username;
        }
        worker.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash("errors", { msg: "username已存在" });
                    return res.redirect("/pc/worker");
                }
                return next(err);
            }
            req.flash("success", { msg: "用户信息更新成功" });
            res.redirect("/pc/worker");
        });
    });
};
exports.postUpdatePassword = (req, res, next) => {
    req.assert("password", "密码应至少4位").len({ min: 6 });
    req.assert("confirmPassword", "两次输入的密码不匹配").equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/pc/worker");
    }
    worker_1.default.findById(req.user.id, (err, worker) => {
        if (err) {
            return next(err);
        }
        worker.password = req.body.password;
        worker.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", { msg: "密码更新成功" });
            res.redirect("/pc/worker");
        });
    });
};
//# sourceMappingURL=worker.js.map