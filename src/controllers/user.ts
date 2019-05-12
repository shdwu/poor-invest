import { NextFunction, Request, Response } from "express";
import { WriteError } from "mongodb";
import { default as User, UserModel } from "../models/user";
import message from "../util/message";

// 更新用户信息
export let postUpdate = (req: Request, res: Response) => {

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) {
      return res.send(err);
    }
    user.name = req.body.name || "";
    user.phone = req.body.phone || "";
    if (req.body.username) {
      user.username = req.body.username;
    }
    user.save((err: WriteError) => {
      if (err) {
        return res.status(400).send(err.errmsg);
      }
      return res.json("更新成功");
    });
  });
};

// 更新密码
export let postUpdatePassword = (req: Request, res: Response) => {
  req.assert("password", "密码应至少6位").len({ min: 6 });
  req.assert("confirmPassword", "两次输入的密码不匹配").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors.pop().msg);
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) { return res.status(400).json("更新密码失败"); }
    user.password = req.body.password;
    user.save((err: WriteError) => {
      if (err) { return res.status(400).json("更新密码失败"); }
      res.send("密码更新成功");
    });
  });
};

export let getUsers = (req: Request, res: Response) => {
  const page = req.params.page || 0;
  User.find({ username: { $ne : "admin" }  }, null, {skip: 10 * page, limit: 10}, (err, users: UserModel[]) => {
    if (err) { return res.json(err); }
    User.find({ username: { $ne : "admin" }  }).count((err, num) => {
      if (err) { return res.json(err); }
      res.json({
        users,
        page,
        num
      });
    });
  });
};

export let addUser = (req: Request, res: Response) => {
  req.assert("username", "用户名不能为空").exists();
  req.assert("password", "登录密码不能为空").exists();
  req.assert("isBureau", "请选择是否是就业局用户").isBoolean();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors.pop().msg);
  }
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name || "",
    phone: req.body.phone || "",
    isBureau: req.body.isBureau
  });

  User.findOne({username: req.body.username}, (err, existingWorker) => {
    if (err) { return res.status(400).json(err); }
    if (existingWorker) {
      return res.status(400).json("用户名已存在");
    }
    user.save((err) => {
      if (err) { return res.status(400).json(err); }
      return res.json("新增用户成功");
    });
  });
};

export let delUser = (req: Request, res: Response) => {
  User.deleteOne({ _id: req.body._id}, (err) => {
    if (err) {
      return res.status(400).json("删除用户失败");
    }
    return res.json("删除用户成功");
  });
};
