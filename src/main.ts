import * as express from "express";
import passport = require("passport");
import expressValidator = require("express-validator");
import * as path from "path";
import mongoose = require("mongoose");
import bluebird = require("bluebird");
import flash = require("express-flash");
import session = require("express-session");
import bodyParser = require("body-parser");
import { MONGODB_URI, SESSION_SECRET, ADMIN_PASSWORD } from "./util/secrets";
import logger from "./util/logger";
import Worker from "./model/worker";

// controller
import * as loginController from "./controller/login";
import * as captchaController from "./controller/captcha";
import * as homeController from "./controller/home";
import * as workerController from "./controller/worker";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

logger.info("贫困人员就业调查系统启动");

const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  logger.info("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

// 如果没有Admin用户新建Admin
Worker.findOne({username: "admin"}, (err, existOne) => {
  if (!existOne) {
    const worker = new Worker({
      username: "admin",
      password: ADMIN_PASSWORD
    });
    worker.save().then(() => {
      logger.info("初始化Admin完成");
    }).catch((err) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
    });
  }
});

app.use(expressValidator());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { httpOnly: true, maxAge: 3600 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// 返回格式转换
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 设置静态资源路径
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
// 设置当前用户
app.use((req, res, next) => {
  res.locals.worker = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/pc/login" &&
    req.path !== "/mobile/login" &&
    req.path !== "/captcha") {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});
app.set("views", path.join(__dirname, "../view"));
app.set("view engine", "pug");

// 通用路由
app.get("/captcha", captchaController.getCaptcha);
// 移动端路由
app.get("/mobile/", passportConfig.isAuthenticated, homeController.mobileIndex);
app.get("/mobile/login", loginController.mobileLogin);
app.get("/mobile/logout", loginController.mobileLogout);
app.post("/mobile/login", loginController.postLogin);
// pc端路由
app.get("/pc/", passportConfig.isAuthenticated, homeController.pcIndex);
app.get("/pc/login", loginController.pcLogin);
app.get("/pc/logout", loginController.pcLogout);
app.post("/pc/login", loginController.postLogin);
app.get("/pc/worker", passportConfig.isAuthenticated, workerController.getWorker);
app.post("/pc/worker", passportConfig.isAuthenticated, workerController.postWorker);
app.post("/pc/worker/password", passportConfig.isAuthenticated, workerController.postUpdatePassword);
// tslint:disable-next-line:max-line-length
app.get("/pc/worker/list/:page", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.getWorkerList);
app.post("/pc/worker/add", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.postAddWorker);
app.get("/pc/worker/del", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.getDelWorker);
app.get("/pc/worker/update", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.postUpdateWorker);


app.listen(3000);
