import { NextFunction, Request, Response } from "express";
import { WriteError } from "mongodb";
import { default as Worker, WorkerModel } from "../models/worker";
import message from "../util/message";

// 获取用户信息
export let getWorker = (req: Request, res: Response) => {
  res.render("pc/worker/profile", {
    title: "Account Management"
  });
};

// 获取用户信息
export let getWorkerList = (req: Request, res: Response) => {
  const page = req.params.page || 0;
  Worker.find({ username: { $ne : "admin" }  }, null, {skip: 10 * page, limit: 10}, (err, workers: WorkerModel[]) => {
    if (err) { return res.json(message("errors", err)); }
    Worker.find({ ussername: { $ne : "admin" }  }).count((err, num) => {
      if (err) { return res.json(message("errors", err));}
      res.json({
        workers,
        page,
        num
      });
    });
  });
};

// Admin新增用户
export let postAddWorker = (req: Request, res: Response, next: NextFunction) => {
  req.assert("username", "用户名不能为空").exists();
  req.assert("password", "登录密码不能为空").exists();
  req.assert("isBureau", "请选择是否是就业局用户").isBoolean();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/pc/worker/list");
  }
  const worker = new Worker({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name || "",
    phone: req.body.phone || "",
    isBureau: req.body.isBureau
  });

  Worker.findOne({username: req.body.username}, (err, existingWorker) => {
    if (err) { return next(err); }
    if (existingWorker) {
      req.flash("errors", "用户名已存在");
      return res.redirect("/pc/worker/list");
    }
    worker.save((err) => {
      if (err) { return next(err); }
      return res.redirect("/pc/worker/list");
    });
  });
};

// Admin删除用户
export let getDelWorker = (req: Request, res: Response) => {
  Worker.deleteOne({ id: req.params.id}, (err) => {
    if (err) { req.flash("errors", "删除用户失败"); }
    return res.redirect("/pc/worker/list");
  });
};

// Admin更新用户
export let postUpdateWorker = (req: Request, res: Response, next: NextFunction) => {
  req.assert("username", "用户名不能为空").exists();
  req.assert("password", "登录密码不能为空").exists();
  req.assert("isBureau", "请选择是否是就业局用户").exists().isBoolean();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/pc/worker/list");
  }

  Worker.findById(req.body.id, (err, worker: WorkerModel) => {
    if (err) { return next(err); }
    worker.name = req.body.name || "";
    worker.phone = req.body.phone || "";
    worker.password = req.body.password;
    worker.username = req.body.username;
    worker.isBureau = req.body.isBureau;

    worker.save((err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          req.flash("errors", { msg: "username已存在" });
          return res.redirect("/pc/worker/list");
        }
        return next(err);
      }
      req.flash("success", { msg: "用户信息更新成功" });
      res.redirect("/pc/worker/list");
    });
  });
};

// 更新用户信息
export let postUpdate = (req: Request, res: Response) => {

  Worker.findById(req.user.id, (err, worker: WorkerModel) => {
    if (err) {
      return res.json(message("errors", err));
    }
    worker.name = req.body.name || "";
    worker.phone = req.body.phone || "";
    if (req.body.username) {
      worker.username = req.body.username;
    }
    worker.save((err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          return res.json(message("errors", "用户名已存在"));
        }
        return res.json(message("errors", err.errmsg));
      }
      return res.json({username: worker.username, name: worker.name, phone: worker.phone, isBureau: worker.isBureau});
    });
  });
};

// 更新密码
export let postUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "密码应至少6位").len({ min: 6 });
  req.assert("confirmPassword", "两次输入的密码不匹配").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({errors});
  }

  Worker.findById(req.user.id, (err, worker: WorkerModel) => {
    if (err) { return next(err); }
    worker.password = req.body.password;
    worker.save((err: WriteError) => {
      if (err) { return next(err); }
      res.json(message("success", "密码更新成功"));
    });
  });
};
